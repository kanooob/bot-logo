/*
 * ==================================================================
 * Bot Logoto ré-écrit et modernisé (Discord.js v14)
 * Auteur de la ré-écriture : Gemini
 * Date : 08/11/2025
 *
 * Fonctionnalités originales conservées :
 * - Changement auto. de logo/nom basé sur le sujet des canaux.
 * - Tâches planifiées (ping, présence, vérification du jour).
 * - Commandes Slash (setup, help, ping, etc.).
 * - Serveur web Express pour la page d'aide.
 *
 * Améliorations :
 * - Mise à jour vers Discord.js v14.
 * - Remplacement de la boucle "while(true)" par des setInterval.
 * - Enregistrement moderne des commandes Slash via l'API REST.
 * - Utilisation des Enums v14 (ActivityType, ChannelType, PermissionsBitField).
 * - Meilleure gestion des erreurs et logs console.
 * ==================================================================
 */

(async () => {
    // Imports principaux
    const { exec } = require("child_process");
    const fs = require('fs');
    const process = require('process');
    const events = require('events'); // Gardé pour l'émission du changement de jour
    const S4D_APP_write = require('write'); // Gardé pour le site web
    const path = require('path');
    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');

    // Imports Discord.js v14
    const {
        Client,
        GatewayIntentBits,
        Partials,
        PermissionsBitField, // Remplacement de Permissions
        ActivityType, // Remplacement des types de présence en string
        REST, // Pour l'enregistrement des commandes
        Routes, // Pour l'enregistrement des commandes
        ChannelType // Pour la création de canaux
    } = require("discord.js");

    const logs = require("discord-logs"); // Gardé

    // --- Vérification des dépendances ---
    // S'assurer que le package.json est à jour pour v14
    try {
        const pkg = require('./package.json');
        if (!pkg.dependencies['discord.js'] || !pkg.dependencies['discord.js'].startsWith("^14.")) {
            console.log("Dépendances obsolètes détectées. Mise à jour de package.json...");
            let file = JSON.parse(fs.readFileSync('package.json'));
            file.dependencies['discord.js'] = '^14.15.2'; // Mise à jour vers v14
            file.dependencies['@discordjs/rest'] = '^2.3.0';
            file.dependencies['discord-api-types'] = '^0.37.83';
            // Ajout des dépendances web si elles manquent
            if (!file.dependencies['express']) file.dependencies['express'] = '^4.19.2';
            if (!file.dependencies['body-parser']) file.dependencies['body-parser'] = '^1.20.2';
            if (!file.dependencies['cors']) file.dependencies['cors'] = '^2.8.5';
            // Suppression de l'ancienne dépendance de commandes
            delete file.dependencies['@frostzzone/discord-sync-commands'];
            fs.writeFileSync('package.json', JSON.stringify(file, null, 4));
            
            console.log("Lancement de 'npm install'... Veuillez patienter.");
            exec('npm install', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur lors de npm install : ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.warn(`Erreurs npm : ${stderr}`);
                }
                console.log(`Sortie npm : ${stdout}`);
                console.log("Mise à jour terminée. Veuillez relancer le bot.");
                process.exit();
            });
            // Arrêter l'exécution actuelle pour permettre à npm de s'exécuter
            return; 
        }
    } catch (e) {
        console.error("Erreur lors de la lecture de package.json. Assurez-vous que le fichier existe et est valide.", e);
        throw e;
    }

    // (La vérification de discord-logs reste la même)
    if (!require('./package.json').dependencies['discord-logs'].startsWith("^2.")) {
      let file = JSON.parse(fs.readFileSync('package.json'))
      file.dependencies['discord-logs'] = '^2.0.0'
      fs.writeFileSync('package.json', JSON.stringify(file, null, 4))
      exec('npm i')
      throw new Error("discord-logs doit être v2.0.0. Veuillez ré-exécuter ou lancer `npm i discord-logs@2.0.0`.");
    }

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const token = process.env[String('token')];
    if (!token) {
        throw new Error("Le token du bot n'est pas défini dans les variables d'environnement (TOKEN)!");
    }

    // --- Initialisation du Client (v14) ---
    const client = new Client({
        intents: [
            // Utilisation de tous les intents, comme dans le code original S4D
            Object.values(GatewayIntentBits)
        ],
        partials: [
            Partials.Reaction,
            Partials.Channel,
            Partials.Message
        ]
    });

    // Émetteur d'événements pour le changement de jour
    const botEmitter = new events.EventEmitter();
    let jour = ((new Date().getDate())) - 1; // Variable globale pour le jour

    // --- Définition des commandes Slash ---
    // (Structure JSON utilisée pour l'enregistrement)
    const commands = [
      {
          name: 'ping',
      	  description: 'Obtenez la latence du bot',
      },
      {
          name: 'setup',
      	  description: 'Première commande a faire',
      },
      {
          name: 'help',
      	  description: 'Les commandes du bot',
      },
      {
          name: 'invite',
      	  description: 'Invitez le bot',
      },
      {
          name: 'support',
      	  description: 'Rejoigniez le serveur de support',
      },
      {
          name: 'logo-add',
      	  description: 'Ajoutez un nouveau changement de logo',
      	  options: [
              {
                  type: 4, // INTEGER
            	  name: 'day',
                  required: true,
            	  description: 'Le jour du changement',
              },
              {
                  type: 4, // INTEGER
            	  name: 'month',
                  required: true,
            	  description: 'Le mois du changement',
              },
          ]
      },
      {
          name: 'name-add',
      	  description: 'Ajoutez un nouveau changement de nom',
      	  options: [
              {
                  type: 4, // INTEGER
            	  name: 'day',
                  required: true,
            	  description: 'Le jour du changement',
              },
              {
                  type: 4, // INTEGER
            	  name: 'month',
                  required: true,
            	  description: 'Le mois du changement',
              },
          ]
      },
    ];

    // --- Gestionnaire d'erreurs ---
    process.on('uncaughtException', function (err) {
        console.error('--- ERREUR NON GÉRÉE ---');
        console.error(err);
        console.error('-------------------------');
    });

    // Initialisation de discord-logs
    logs(client);

    // --- TÂCHES PLANIFIÉES (Remplacement de la boucle while) ---

    // Met à jour la présence du bot
    function updatePresence() {
        if (!client.user) return; // Ne rien faire si le bot n'est pas prêt
        try {
            // Calcul plus précis des membres (évite les bots non-GUILD_MEMBERS)
            const userCount = client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0); 
            const guildCount = client.guilds.cache.size;
            
            client.user.setPresence({
                status: "online",
                activities: [{
                    name: `${userCount} membres, ${guildCount} serveurs.`,
                    type: ActivityType.Watching // Utilisation de l'enum v14
                }]
            });
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la présence:", error);
        }
    }

    // Vérifie si le jour a changé
    function checkDayChange() {
        const currentDay = new Date().getDate();
        if (jour !== currentDay) {
            console.log(`Changement de jour détecté (de ${jour} à ${currentDay}). Émission de 'dayChange'.`);
            jour = currentDay;
            botEmitter.emit('dayChange');
        }
    }

    // Envoie le ping et l'uptime
    function sendPing() {
         try {
            const ms_on = client.uptime;
            const channel = client.channels.cache.get('1387514903778295940');
            if (channel) {
                channel.send({
                    content: [
                        `Ping : **${client.ws.ping}ms**`,
                        `Temps de fonctionnement : **${Math.round(ms_on / 3600000)} heures.**`
                    ].join('\n')
                });
            } else {
                console.warn("Canal de ping (1387514903778295940) non trouvé.");
            }
         } catch (error) {
             console.error("Erreur lors de l'envoi du ping:", error);
         }
    }

    // --- ÉVÉNEMENT READY (Démarrage) ---
    client.on('ready', async () => {
        console.log(`${client.user.tag} est en ligne !`);

        // Enregistrement des commandes Slash
        try {
            const rest = new REST({ version: '10' }).setToken(token);
            console.log("Démarrage de l'enregistrement des commandes slash (/)");
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
            console.log("Commandes slash (/) enregistrées avec succès.");
        } catch (error) {
            console.error("Erreur lors de l'enregistrement des commandes slash:", error);
        }

        // Démarrage des tâches planifiées
        updatePresence(); // Mettre à jour immédiatement
        checkDayChange(); // Vérifier immédiatement
        
        // Planification des tâches récurrentes
        // Toutes les 3 minutes (180 000 ms), comme dans le code original
        setInterval(() => {
            updatePresence();
            checkDayChange(); // Vérification du jour
            sendPing(); // Envoi du ping
        }, 180 * 1000); 

        // Envoi du message de démarrage
        try {
            const startChannel = client.channels.cache.get('1413899996691955755');
            if (startChannel) {
                startChannel.send({ content: 'Démarrage du bot...' });
            } else {
                 console.warn("Canal de démarrage (1413899996691955755) non trouvé.");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du message de démarrage:", error);
        }
    });

    // --- GESTIONNAIRES D'ÉVÉNEMENTS ---

    // Événement personnalisé pour le changement de jour
    botEmitter.on('dayChange', async () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1; // getMonth() est 0-indexé
        
        const logoChannelName = `l-${day}-${month}`;
        const nameChannelName = `n-${day}-${month}`;

        console.log(`Exécution de 'dayChange' pour les canaux: ${logoChannelName}, ${nameChannelName}`);

        client.guilds.cache.forEach(async (guild) => {
            try {
                // Trouve le canal logo
                const logoChannel = guild.channels.cache.find(c => c.name === logoChannelName && c.type === ChannelType.GuildText);
                if (logoChannel) {
                    await logoChannel.send({ content: '🔁 Changement...' });
                    await delay(2000); // Délai
                }

                // Trouve le canal nom
                const nameChannel = guild.channels.cache.find(c => c.name === nameChannelName && c.type === ChannelType.GuildText);
                if (nameChannel) {
                    await nameChannel.send({ content: '🔁 Changement...' });
                }
            } catch (error) {
                console.error(`Erreur lors de l'événement 'dayChange' pour le serveur ${guild.name} (${guild.id}):`, error);
            }
        });
    });

    // Événement de création de message (pour déclencher les changements)
    client.on('messageCreate', async (message) => {
        // Ignorer les DMs et les messages de bots
        if (!message.guild || message.author.bot) return; 
        // S'assurer qu'on a les permissions d'intents
        if (!message.channel || !message.channel.name) return; 

        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;

        const logoChannelName = `l-${day}-${month}`;
        const nameChannelName = `n-${day}-${month}`;

        try {
            // Logique pour le changement de NOM
            if (message.channel.name === nameChannelName) {
                const newName = message.channel.topic;
                if (!newName) {
                    console.warn(`Le canal ${nameChannelName} dans ${message.guild.name} n'a pas de sujet (topic).`);
                    return;
                }

                await message.guild.setName(newName, 'Changement de nom programmé par Logoto');
                console.log(`Changement du nom du serveur : ${message.guild.name} (${message.guild.id}) en "${newName}".`);
                
                // Envoi du log
                const logChannel = message.guild.channels.cache.find(c => c.name === 'log-logoto' && c.type === ChannelType.GuildText);
                if (logChannel) {
                    logChannel.send({
                        content: [
                            `✅ **Le nom du serveur à été mis à jour !**`,
                            `Action : Changer le nom du serveur. Date : ${day}-${month}-${date.getFullYear()}`,
                            `Nom : ${newName}`
                        ].join('\n')
                    });
                }
            }

            // Logique pour le changement de LOGO
            if (message.channel.name === logoChannelName) {
                const newIconURL = message.channel.topic;
                if (!newIconURL || !newIconURL.startsWith('https://cdn.discordapp.com/')) {
                    console.warn(`Le canal ${logoChannelName} dans ${message.guild.name} n'a pas de sujet (topic) valide (doit commencer par https://cdn.discordapp.com/).`);
                    return;
                }
                
                await message.guild.setIcon(newIconURL, 'Changement de logo programmé par Logoto');
                console.log(`Changement de logo du serveur : ${message.guild.name} (${message.guild.id}).`);

                // Envoi du log
                const logChannel = message.guild.channels.cache.find(c => c.name === 'log-logoto' && c.type === ChannelType.GuildText);
                if (logChannel) {
                    logChannel.send({
                        content: [
                            `✅ **Logo du serveur à été mis à jour !**`,
                            `Action : Changer de logo du serveur. Date : ${day}-${month}-${date.getFullYear()}`,
                            `Logo : ${newIconURL}`
                        ].join('\n')
                    });
                }
            }
        } catch (error) {
            console.error(`Erreur lors du traitement de messageCreate pour ${message.guild.name}:`, error);
            // Envoyer un message d'erreur dans le canal log si possible
            const logChannel = message.guild.channels.cache.find(c => c.name === 'log-logoto' && c.type === ChannelType.GuildText);
            if (logChannel) {
                logChannel.send({ content: `❌ Erreur lors du changement automatique : ${error.message}` });
            }
        }
    });

    // Événement d'ajout à un serveur
    client.on('guildCreate', async (guild) => {
        try {
            const logChannel = client.channels.cache.get('1432341468059537419');
            if (logChannel) {
                logChannel.send({ content: `Bot ajouté dans **${guild.name}** (${guild.id}).` });
            } else {
                console.warn("Canal de log 'guildCreate' (1432341468059537419) non trouvé.");
            }
        } catch (error) {
            console.error("Erreur lors de l'événement guildCreate:", error);
        }
    });

    // --- GESTIONNAIRE DES INTERACTIONS (Commandes Slash v14) ---
    client.on('interactionCreate', async (interaction) => {
        // Ne gérer que les commandes chat
        if (!interaction.isChatInputCommand()) return; 

        const { commandName, guild, options } = interaction;

        try {
            if (commandName === 'ping') {
                await interaction.reply({
                    content: [
                        `Pong ! **${client.ws.ping}ms**.`,
                        `[Status page](https://logoto.betteruptime.com/)`
                    ].join('\n'),
                    ephemeral: false
                });
            }
            
            else if (commandName === 'help') {
                await interaction.reply({
                    content: [
                        'Aide de Logoto - Automatisez votre Logo !',
                        '====================================',
                        '**Je suis le bot spécialisé dans l\'automatisation du changement de logo de votre serveur, sans nécessiter de commandes complexes après la configuration.**',
                        '###',
                        'Les commandes',
                        '* **`/setup`** : Crée un salon de démonstration pour comprendre le fonctionnement et démarrer rapidement la configuration.',
                        '* **`/logo-add`** : Crée un salon de changement de logo avec les options day (Obligatoire, pour le jour), month (Obligatoire, pour le mois).',
                        '* **`/name-add`** : Crée un salon de changement de nom avec les options day (Obligatoire, pour le jour), month (Obligatoire, pour le mois).',
                        '* **`/help`** : Affiche ce message d\'aide.',
                        '* **`/invite`** : Invitez le bot dans votre serveurs.',
                        '* **`/support`** : Rejoigniez le serveur de support.',
                        'Pour l\'aide complète :[Ici](https://logoto.onrender.com/help)',
                        'For english help :[Here](https://logoto.onrender.com/help)'
                    ].join('\n'),
                    ephemeral: false
                });
            }
            
            else if (commandName === 'invite') {
                await interaction.reply({
                    content: [
                        'Voici le lien d\'invitation du bot Discord :[lien](https://discord.com/oauth2/authorize?client_id=1431383390162124920)',
                        'Here is the link to add the bot: [link](https://discord.com/oauth2/authorize?client_id=1431383390162124920)'
                    ].join('\n'),
                    ephemeral: false
                });
            }
            
            else if (commandName === 'support') {
                 await interaction.reply({
                    content: [
                        'Voici le lien vers le serveur de support :[lien](https://discord.gg/TPXFVYVnXe)',
                        'Here is the link to the support server: [link](https://discord.gg/TPXFVYVnXe)'
                    ].join('\n'),
                    ephemeral: false
                });
            }

            // Commande Setup
            else if (commandName === 'setup') {
                // Créer la catégorie
                const category = await guild.channels.create({
                    name: 'Logoto',
                    type: ChannelType.GuildCategory // Utilisation de l'enum v14
                });

                // Créer le canal log
                const logChannel = await guild.channels.create({
                    name: 'log-logoto',
                    type: ChannelType.GuildText,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id, // @everyone
                            deny: [PermissionsBitField.Flags.ViewChannel] // v14
                        }
                    ]
                });
                await logChannel.send({
                    content: [
                        '**Salon des log à été créé**',
                        'Vous obtiendrez les actions fait par le bot dans se salon',
                        '\n',
                        '**Log room has been created**',
                        'You will find the actions performed by the bot in this room.'
                    ].join('\n')
                });

                // Créer le canal d'exemple logo
                const date = new Date();
                const logoChannelName = `l-${date.getDate()}-${date.getMonth() + 1}`;
                
                const logoChannel = await guild.channels.create({
                    name: logoChannelName,
                    type: ChannelType.GuildText,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        }
                    ]
                });
                await logoChannel.send({
                    content: [
                        '**C\'est bientôt fini !**',
                        'Il vous reste plus qu\'à mettre le lien d\'une image dans le sujet sur salon, il faut que le lien soit une url discord',
                        '-# (elle doit commencer par https://cdn.discordapp.com/attachments).',
                        '\n',
                        '**It\'s almost over!**',
                        'All that\'s left is to add a link to an image in the thread in the chat room. The link must be a Discord URL',
                        '-# (it must begin with https://cdn.discordapp.com/attachments).'
                    ].join('\n')
                });

                await interaction.reply({ content: `La catégorie 'Logoto' et les canaux d'exemple ont été créés : ${logoChannel}, ${logChannel}`, ephemeral: true });
            }

            // Commande Logo-add
            else if (commandName === 'logo-add') {
                const day = options.getInteger('day');
                const month = options.getInteger('month');
                const category = guild.channels.cache.find(c => c.name === 'Logoto' && c.type === ChannelType.GuildCategory);
                
                if (!category) {
                    await interaction.reply({ content: 'Erreur : La catégorie "Logoto" n\'existe pas. Veuillez d\'abord faire `/setup`.', ephemeral: true });
                    return;
                }

                const newChannel = await guild.channels.create({
                    name: `l-${day}-${month}`,
                    type: ChannelType.GuildText,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        }
                    ]
                });
                
                await newChannel.send({
                    content: [
                        '**C\'est bientôt fini !**',
                        'Il vous reste plus qu\'à mettre le lien d\'une image dans le sujet sur salon, il faut que le lien soit une url discord',
                        '(elle doit commencer par https://cdn.discordapp.com/attachments).',
                        '\n',
                        '**It\'s almost over!**',
                        'All that\'s left is to add a link to an image in the thread in the chat room. The link must be a Discord URL',
                        '(it must begin with https://cdn.discordapp.com/attachments).'
                    ].join('\n')
                });

                await interaction.reply({ content: `Le salon à été créé : ${newChannel}`, ephemeral: true });
            }

            // Commande Name-add
            else if (commandName === 'name-add') {
                const day = options.getInteger('day');
                const month = options.getInteger('month');
                const category = guild.channels.cache.find(c => c.name === 'Logoto' && c.type === ChannelType.GuildCategory);

                if (!category) {
                    await interaction.reply({ content: 'Erreur : La catégorie "Logoto" n\'existe pas. Veuillez d\'abord faire `/setup`.', ephemeral: true });
                    return;
                }

                const newChannel = await guild.channels.create({
                    name: `n-${day}-${month}`,
                    type: ChannelType.GuildText,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        }
                    ]
                });

                await newChannel.send({
                    content: [
                        '**C\'est bientôt fini !**',
                        'Il vous reste plus qu\'à mettre le nom du serveur que vous voulez dans le sujet.',
                        '\n',
                        '**Almost done!**',
                        'All you have to do now is put the name of the server you want in the subject line.'
                    ].join('\n')
                });

                await interaction.reply({ content: `Le salon à été créé : ${newChannel}`, ephemeral: true });
            }

        } catch (error) {
            console.error(`Erreur lors de l'interaction '${commandName}':`, error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Une erreur est survenue lors de l\'exécution de cette commande.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de cette commande.', ephemeral: true });
            }
        }
    });

    // --- SERVEUR WEB (Express) ---
    // (Logique identique à l'original, mais utilise le port ENV pour Render/Heroku)
    const app = express();
    const PORT = process.env.PORT || 8080; 

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.all('/help', async function(req, res) {
        // Le contenu HTML est long, nous le gardons tel quel.
        const helpHTML = `<!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Aide de Logoto - Automatisez votre Logo & Nom</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 20px;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .container {
                    max-width: 900px;
                    margin: auto;
                    background: #fff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #7289da; /* Couleur Discord */
                    border-bottom: 2px solid #7289da;
                    padding-bottom: 10px;
                }
                h2 {
                    color: #5865f2;
                    margin-top: 30px;
                }
                code {
                    background-color: #eee;
                    padding: 2px 4px;
                    border-radius: 4px;
                }
                .command-list {
                    list-style-type: none;
                    padding: 0;
                }
                .command-list li {
                    margin-bottom: 10px;
                }
                .note {
                    background-color: #fff3cd;
                    border-left: 5px solid #ffc107;
                    padding: 15px;
                    margin-top: 20px;
                    border-radius: 4px;
                }
                .lang-switch button {
                    background-color: #7289da;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    cursor: pointer;
                    border-radius: 4px;
                    margin-left: 10px;
                    font-weight: bold;
                    transition: background-color 0.3s;
                }
                .lang-switch button:hover {
                    background-color: #5865f2;
                }
                .lang-switch {
                    text-align: center;
                    margin-bottom: 20px;
                }
                hr {
                    border: 0;
                    border-top: 1px dashed #ddd;
                    margin: 30px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="lang-switch">
                    <button onclick="changeLanguage('fr')">Afficher en Français</button>
                    <button onclick="changeLanguage('en')">Display in English</button>
                </div>
    
                <div id="content-area">
                    </div>
            </div>
    
            <script>
                // --- Contenu Français ---
                const contentFR = \`
                    <h1>Aide de Logoto - Automatisez votre Logo & Nom ! 🇫🇷</h1>
                    <p>Je suis le bot spécialisé dans l'automatisation du changement de logo ET du nom de votre serveur, sans nécessiter de commandes complexes après la configuration.</p>
    
                    <h2>Les Commandes</h2>
                    <ul class="command-list">
                        <li><code>/setup</code> : Crée un salon de démonstration pour comprendre le fonctionnement et démarrer rapidement la configuration.</li>
                        <li><code>/logo-add</code> : Crée un salon de changement de logo avec les options <code>day</code> (Obligatoire, pour le jour) et <code>month</code> (Obligatoire, pour le mois).</li>
                        <li><code>/name-add</code> : Crée un salon de changement de nom du serveur avec les options <code>day</code> et <code>month</code>.</li>
                        <li><code>/help</code> : Affiche ce message d'aide (ou cette page !).</li>
                        <li><code>/invite</code> : Obtenez le lien pour inviter le bot sur votre serveur.</li>
                        <li><code>/support</code> : Rejoignez le serveur de support pour toute question ou aide.</li>
                    </ul>
    
                    <hr>
    
                    <h2>Système de Changement de Logo Automatique (Configuration Manuelle)</h2>
                    <p>Le bot surveille un salon spécifique pour planifier et exécuter les changements de logo. Voici comment le configurer manuellement :</p>
    
                    <ol>
                        <li>
                            Créez le Salon de Planification (Logo) :
                            <ul>
                                <li>Le nom du salon doit être au format suivant : <code>l-[JOUR]-[MOIS]</code></li>
                                <li>EXEMPLE : Pour un logo qui changera le 31 décembre sur un serveur : <code>l-31-12</code></li>
                            </ul>
                        </li>
                        <li>
                            Préparez le Logo :
                            <ul>
                                <li>Envoyez votre image de logo sur n'importe quel salon Discord et copiez son lien direct. (Doit commencer par https://cdn.discordapp.com/)</li>
                            </ul>
                        </li>
                        <li>
                            Planifiez le Changement :
                            <ul>
                                <li>Modifiez le Sujet du Salon (Channel Topic) créé à l'étape 1.</li>
                                <li>Collez le **lien** de votre image dans le sujet du salon.</li>
                            </ul>
                        </li>
                        <li>
                            Résultat :
                            <ul>
                                <li>Le bot changera automatiquement le logo du serveur au jour et au mois spécifiés dans le nom du salon !</li>
                            </ul>
                        </li>
                    </ol>
    
                    <hr>
    
                    <h2>Système de Changement de Nom Automatique (Configuration Manuelle)</h2>
                    <p>Le bot surveille un autre salon pour modifier le nom de votre serveur. Voici comment le configurer manuellement :</p>
    
                    <ol>
                        <li>
                            Créez le Salon de Planification (Nom) :
                            <ul>
                                <li>Le nom du salon doit être au format suivant : <code>n-[JOUR]-[MOIS]</code></li>
                                <li>EXEMPLE : Pour un nom qui changera le 31 décembre sur un serveur : <code>n-31-12</code></li>
                            </ul>
                        </li>
                        <li>
                            Planifiez le Changement :
                            <ul>
                                <li>Modifiez le Sujet du Salon (Channel Topic) créé à l'étape 1.</li>
                                <li>Écrivez le **nouveau nom du serveur** dans le sujet du salon.</li>
                            </ul>
                        </li>
                        <li>
                            Résultat :
                            <ul>
                                <li>Le bot changera automatiquement le nom du serveur au jour et au mois spécifiés dans le nom du salon !</li>
                            </ul>
                        </li>
                    </ol>
    
                    <div class="note">
                        NOTE IMPORTANTE : Le changement (logo OU nom) se déclenche quand un message est envoyé sur le serveur dans le bon canal. Le bot envoie lui-même un message discret ("🔁 Changement...") en début de journée pour s'assurer que le changement se fasse, donc pas besoin de s'inquiéter.
                    </div>
                \`;
    
                // --- Contenu Anglais ---
                const contentEN = \`
                    <h1>Logoto Help - Automate your Logo & Name! 🇬🇧</h1>
                    <p>I am the bot specialized in automating the change of your server's logo AND name, without requiring complex commands after the initial setup.</p>
    
                    <h2>Commands</h2>
                    <ul class="command-list">
                        <li><code>/setup</code> : Creates a demonstration channel to understand the process and quickly start the configuration.</li>
                        <li><code>/logo-add</code> : Creates a logo change channel with the options <code>day</code> (Required) and <code>month</code> (Required).</li>
                        <li><code>/name-add</code> : Creates a server name change channel with the options <code>day</code> and <code>month</code>.</li>
                        <li><code>/help</code> : Displays this help message (or this page!).</li>
                        <li><code>/invite</code> : Get the link to invite the bot to your server.</li>
                        <li><code>/support</code> : Join the support server for any questions or assistance.</li>
                    </ul>
    
                    <hr>
    
                    <h2>Automatic Logo Change System (Manual Setup)</h2>
                    <p>The bot monitors a specific channel to schedule and execute logo changes. Here's how to configure it manually:</p>
    
                    <ol>
                        <li>
                            Create the Scheduling Channel (Logo):
                            <ul>
                                <li>The channel name must follow this format: <code>l-[DAY]-[MONTH]</code></li>
                                <li>EXAMPLE: For a logo that will change on December 31st on a server: <code>l-31-12</code></li>
                            </ul>
                        </li>
                        <li>
                            Prepare the Logo:
                            <ul>
                                <li>Upload your logo image to any Discord channel and copy its direct link. (Must start with https://cdn.discordapp.com/)</li>
                            </ul>
                        </li>
                        <li>
                            Schedule the Change:
                            <ul>
                                <li>Edit the Channel Topic of the channel you created in step 1.</li>
                                <li>Paste the **link** of your image into the channel topic.</li>
                            </ul>
                        </li>
                        <li>
                            Result:
                            <ul>
                                <li>The bot will automatically change the server logo on the day and month specified in the channel name!</li>
                            </ul>
                        </li>
                    </ol>
    
                    <hr>
    
                    <h2>Automatic Name Change System (Manual Setup)</h2>
                    <p>The bot monitors another channel to modify your server's name. Here's how to configure it manually:</p>
    
                    <ol>
                        <li>
                            Create the Scheduling Channel (Name):
                            <ul>
                                <li>The channel name must follow this format: <code>n-[DAY]-[MONTH]</code></li>
                                <li>EXAMPLE: For a name that will change on January 1st on a server: <code>n-01-01</code></li>
                            </ul>
                        </li>
                        <li>
                            Schedule the Change:
                            <ul>
                                <li>Edit the Channel Topic of the channel you created in step 1.</li>
                                <li>Write the **new server name** in the channel topic.</li>
                            </ul>
                        </li>
                        <li>
                            Result:
                            <ul>
                                <li>The bot will automatically change the server name on the day and month specified in the channel name!</li>
                            </ul>
                        </li>
                    </ol>
    
                    <div class="note">
                        IMPORTANT NOTE: The change (logo OR name) is triggered when a message is sent on the server in the correct channel. The bot sends a discreet message ("🔁 Changement...") itself at the beginning of the day to ensure the change happens, so you don't need to worry.
                    </div>
                \`;
    
                /**
                 * Fonction pour changer le contenu de la page
                 * @param {string} lang - La langue à afficher ('fr' ou 'en')
                 */
                function changeLanguage(lang) {
                    const contentArea = document.getElementById('content-area');
                    if (lang === 'fr') {
                        contentArea.innerHTML = contentFR;
                        document.documentElement.lang = 'fr'; // Met à jour l'attribut lang de la page
                    } else if (lang === 'en') {
                        contentArea.innerHTML = contentEN;
                        document.documentElement.lang = 'en'; // Met à jour l'attribut lang de la page
                    }
                    // Remonte en haut de la page pour une meilleure UX
                    window.scrollTo(0, 0);
                }
    
                // Affiche le contenu français par défaut au chargement de la page
                document.addEventListener('DOMContentLoaded', () => {
                    changeLanguage('fr');
                });
            </script>
        </body>
        </html>`;
        
        // Utilisation de S4D_APP_write pour créer le fichier, comme dans l'original
        S4D_APP_write.sync(String('help.html'), helpHTML, { overwrite: true });
        res.sendFile(path.join(__dirname, String('help.html')));
    });

    // Réponse par défaut pour les autres routes web
    app.use(function(req, res) {
        res.send(String('Ce bot à été créé le 24/10/2025 | https://logoto.onrender.com/help'));
    });

    // Démarrage du serveur web
    app.listen(PORT, () => {
        console.log(`Serveur web démarré sur le port ${PORT}`);
    });


    // --- CONNEXION DU BOT ---
    try {
        await client.login(token);
    } catch (e) {
        if (e.toString().toLowerCase().includes("token")) {
            throw new Error("Un jeton de bot non valide a été fourni !");
        } else {
            console.error(e);
            throw new Error("Les 'Privileged Gateway Intents' ne sont pas activés ! Veuillez aller sur https://discord.com/developers et les activer tous.");
        }
    }

})();