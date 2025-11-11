(async()=>{
    // default imports
    const events = require('events');
    const { exec } = require("child_process")
    const logs = require("discord-logs")
    const Discord = require("discord.js")
    const { 
        MessageEmbed, 
        MessageButton, 
        MessageActionRow, 
        Intents, 
        Permissions, 
        MessageSelectMenu 
    }= require("discord.js")
    const fs = require('fs');
    let process = require('process');
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // block imports
    const os = require("os-utils");
    let URL = require('url')
    const ms = require("ms")
    let https = require("https")
    const S4D_APP_write = require('write');
    var eventEmitter = new events.EventEmitter();
    const synchronizeSlashCommands = require('@frostzzone/discord-sync-commands');
    const S4D_WEBSITECREATION_EXPRESS = require('express')
const S4D_WEBSITECREATION_bodyParser = require('body-parser');
const S4D_WEBSITECREATION_cors = require('cors');
var S4D_WEBSITECREATION_path = require('path');
const S4D_WEBSITECREATION_EXPRESS_app = S4D_WEBSITECREATION_EXPRESS();
    
    // define s4d components (pretty sure 90% of these arnt even used/required)
    let s4d = {
        Discord,
        fire:null,
        joiningMember:null,
        reply:null,
        player:null,
        manager:null,
        Inviter:null,
        message:null,
        notifer:null,
        checkMessageExists() {
            if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
            if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
        }
    };

    // check if d.js is v13
    if (!require('./package.json').dependencies['discord.js'].startsWith("^13.")) {
      let file = JSON.parse(fs.readFileSync('package.json'))
      file.dependencies['discord.js'] = '^13.16.0'
      fs.writeFileSync('package.json', JSON.stringify(file, null, 4))
      exec('npm i')
      throw new Error("Seems you arent using v13 please re-run or run `npm i discord.js@13.16.0`");
    }

    // check if discord-logs is v2
    if (!require('./package.json').dependencies['discord-logs'].startsWith("^2.")) {
      let file = JSON.parse(fs.readFileSync('package.json'))
      file.dependencies['discord-logs'] = '^2.0.0'
      fs.writeFileSync('package.json', JSON.stringify(file, null, 4))
      exec('npm i')
      throw new Error("discord-logs must be 2.0.0. please re-run or if that fails run `npm i discord-logs@2.0.0` then re-run");
    }

    // create a new discord client
    s4d.client = new s4d.Discord.Client({
        intents: [
            Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)
        ],
        partials: [
            "REACTION", 
            "CHANNEL"
        ]
    });

    // when the bot is connected say so
    s4d.client.on('ready', () => {
        console.log(s4d.client.user.tag + " is alive!")
    })

    // upon error print "Error!" and the error
    process.on('uncaughtException', function (err) {
        console.log('Error!');
        console.log(err);
    });

    // give the new client to discord-logs
    logs(s4d.client);

    // pre blockly code
    

    // blockly code
    var jour, ms_on;
    
    
    await s4d.client.login((process.env[String('token')])).catch((e) => {
            const tokenInvalid = true;
            const tokenError = e;
            if (e.toString().toLowerCase().includes("token")) {
                throw new Error("An invalid bot token was provided!")
            } else {
                throw new Error("Privileged Gateway Intents are not enabled! Please go to https://discord.com/developers and turn on all of them.")
            }
        });
    
    synchronizeSlashCommands(s4d.client, [
      {
          name: 'ping',
      		description: 'Obtenez la latence du bot',
      		options: [
    
          ]
      },{
          name: 'setup',
      		description: 'Première commande a faire',
      		options: [
    
          ]
      },{
          name: 'help',
      		description: 'Les commandes du bot',
      		options: [
    
          ]
      },{
          name: 'invite',
      		description: 'Invitez le bot',
      		options: [
    
          ]
      },{
          name: 'support',
      		description: 'Rejoigniez le serveur de support',
      		options: [
    
          ]
      },{
          name: 'logo-add',
      		description: 'Ajoutez un nouveau changement de logo',
      		options: [
              {
            type: 4,
        	name: 'day',
            required: true,
        	description: 'Le jour du changement',
            choices: [
    
            ]
        },{
            type: 4,
        	name: 'month',
            required: true,
        	description: 'Le mois du changement',
            choices: [
    
            ]
        },
          ]
      },{
          name: 'name-add',
      		description: 'Ajoutez un nouveau changement de nom',
      		options: [
              {
            type: 4,
        	name: 'day',
            required: true,
        	description: 'Le jour du changement',
            choices: [
    
            ]
        },{
            type: 4,
        	name: 'month',
            required: true,
        	description: 'Le mois du changement',
            choices: [
    
            ]
        },
          ]
      },
    ],{
        debug: false,
    
    });
    
    s4d.client.on('ready', async () => {
      jour = ((new Date().getDate())) - 1;
      s4d.client.channels.cache.get('1413899996691955755').send({content:String('Démarrage du bot...')});
    
              while(s4d.client && s4d.client.token) {
                  await delay(50);
                    s4d.client.user.setPresence({status: "online",activities:[{name:([s4d.client.users.cache.size,' membres, ',s4d.client.guilds.cache.size,' serveurs.'].join('')),type:"WATCHING"}]});
        await delay(Number(180)*1000);
        if (jour != ((new Date().getDate()))) {
          jour = ((new Date().getDate()));
          eventEmitter.emit('1');
        }
        ms_on = (s4d.client.uptime);
        s4d.client.channels.cache.get('1387514903778295940').send({content:String((['Ping :**',s4d.client.ws.ping,'\n','**Temps de fonctionnement **',Math.round(ms_on / 3600000),'** heures.'].join('')))});
    
                  console.log('ran')
              }
    
    });
    
    s4d.client.on('interactionCreate', async (interaction) => {
              if ((interaction.commandName) == 'setup') {
        (interaction.guild).channels.create('Logoto', { type: 'GUILD_CATEGORY' }).then(async cat => {  (interaction.guild).channels.create((['l-',(new Date().getDate()),'-',((new Date().getMonth())) + 1].join('')), { type: "GUILD_TEXT", parent: (cat) }).then(async cat =>{  (cat).permissionOverwrites.edit(((interaction.guild).roles.cache.get(((interaction.guild).id))), { VIEW_CHANNEL: false });(cat).send({content:String(([`**C'est bientôt fini !**
            Il vous reste plus qu'à mettre le lien d'une image dans le sujet sur salon, il faut que le lien soit une url discord
            -# (elle doit commencer par https://cdn.discordapp.com/attachments).`,'\n',`**It's almost over!**
            All that's left is to add a link to an image in the thread in the chat room. The link must be a Discord URL
            -# (it must begin with https://cdn.discordapp.com/attachments).`].join('')))});
            await interaction.reply({ content: ('Le salon à été créé :' + String(cat)), ephemeral: true, components: [] });
          });(interaction.guild).channels.create('log-logoto', { type: "GUILD_TEXT", parent: (cat) }).then(async cat =>{  (cat).permissionOverwrites.edit(((interaction.guild).roles.cache.get(((interaction.guild).id))), { VIEW_CHANNEL: false });(cat).send({content:String(([`**Salon des log à été créé**
            Vous obtiendrez les actions fait par le bot dans se salon`,'\n',`**Log room has been created**
            You will find the actions performed by the bot in this room.`].join('')))});
          });});
      }
      if ((interaction.commandName) == 'help') {
        await interaction.reply({ content: (['Aide de Logoto - Automatisez votre Logo !','\n','====================================','\n','**Je suis le bot spécialisé dans l\'automatisation du changement de logo de votre serveur, sans nécessiter de commandes complexes après la configuration.**','\n','###','\n','Les commandes','\n','* **`/setup`** : Crée un salon de démonstration pour comprendre le fonctionnement et démarrer rapidement la configuration.','\n','* **`/logo-add`** : Crée un salon de changement de logo avec les options day (Obligatoire, pour le jour), month (Obligatoire, pour le mois).','\n','* **`/name-add`** : Crée un salon de changement de nom avec les options day (Obligatoire, pour le jour), month (Obligatoire, pour le mois).','\n','* **`/help`** : Affiche ce message d\'aide.','\n','* **`/invite`** : Invitez le bot dans votre serveurs.','\n','* **`/support`** : Rejoigniez le serveur de support.','\n','Pour l\'aide complète :[Ici](https://logoto.onrender.com/help)','\n','For english help :[Here](https://logoto.onrender.com/help)'].join('')), ephemeral: false, components: [] });
      }
      if ((interaction.commandName) == 'invite') {
        await interaction.reply({ content: (['Voici le lien d\'invitation du bot Discord :[lien](https://discord.com/oauth2/authorize?client_id=1431383390162124920)','\n','Here is the link to add the bot: [link](https://discord.com/oauth2/authorize?client_id=1431383390162124920)'].join('')), ephemeral: false, components: [] });
      }
      if ((interaction.commandName) == 'ping') {
        await interaction.reply({ content: (['Pong !**','\n',s4d.client.ws.ping,'ms**.','\n','[Status page](https://logoto.betteruptime.com/)'].join('')), ephemeral: false, components: [] });
      }
      if ((interaction.commandName) == 'support') {
        await interaction.reply({ content: (['Voici le lien vers le serveur de support :[lien](https://discord.gg/TPXFVYVnXe)','\n','Here is the link to the support server: [link](https://discord.gg/TPXFVYVnXe)'].join('')), ephemeral: false, components: [] });
      }
      if ((interaction.commandName) == 'logo-add') {
        (interaction.guild).channels.create((['l-',interaction.options.getInteger('day'),'-',interaction.options.getInteger('month')].join('')), { type: "GUILD_TEXT", parent: (interaction.guild).channels.cache.find((category) => category.name === 'Logoto') }).then(async cat =>{  (cat).permissionOverwrites.edit(((interaction.guild).roles.cache.get(((interaction.guild).id))), { VIEW_CHANNEL: false });(cat).send({content:String(([`**C'est bientôt fini !**
          Il vous reste plus qu'à mettre le lien d'une image dans le sujet sur salon, il faut que le lien soit une url discord
          (elle doit commencer par https://cdn.discordapp.com/attachments).`,'\n',`**It's almost over!**
          All that's left is to add a link to an image in the thread in the chat room. The link must be a Discord URL
          (it must begin with https://cdn.discordapp.com/attachments).`].join('')))});
          await interaction.reply({ content: ('Le salon à été créé :' + String(cat)), ephemeral: true, components: [] });
        });}
      if ((interaction.commandName) == 'name-add') {
        (interaction.guild).channels.create((['n-',interaction.options.getInteger('day'),'-',interaction.options.getInteger('month')].join('')), { type: "GUILD_TEXT", parent: (interaction.guild).channels.cache.find((category) => category.name === 'Logoto') }).then(async cat =>{  (cat).permissionOverwrites.edit(((interaction.guild).roles.cache.get(((interaction.guild).id))), { VIEW_CHANNEL: false });(cat).send({content:String(([`**C'est bientôt fini !**
          Il vous reste plus qu'à mettre le nom du serveur que vous voulez dans le sujet.`,'\n',`**Almost done!**
          All you have to do now is put the name of the server you want in the subject line.`].join('')))});
          await interaction.reply({ content: ('Le salon à été créé :' + String(cat)), ephemeral: true, components: [] });
        });}
    
        });
    
    /* IMPORTED - S4D Website Hosting Dependencies */
    let S4D_APP_WEBSITE_HOSTING_PORT = 8080
    
    S4D_WEBSITECREATION_EXPRESS_app.use(S4D_WEBSITECREATION_cors());
    S4D_WEBSITECREATION_EXPRESS_app.use(S4D_WEBSITECREATION_bodyParser.urlencoded({
        extended: false
    }));
    S4D_WEBSITECREATION_EXPRESS_app.use(S4D_WEBSITECREATION_bodyParser.json());
    
      S4D_WEBSITECREATION_EXPRESS_app.all('/help', async function(req, res) {
          S4D_APP_write.sync(String('help.html'), String(`<!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Aide de Logoto - Automatisez votre Logo & Nom</title>
            <link rel="icon" type="image/png" href="https://lh3.googleusercontent.com/_kv5f0rdRhClKfzfSL2xgT25oPADwCIPKSZNRMvnnxqh3TYSt8GXq-k2aSKEvxvalHGC0fMD39sNd9RN4e6Rv7U">
    
            <style>
                /* ---------------------------------------------------- */
                /* STYLES DE BASE & CONTRASTE (Accessibilité OK) */
                /* ---------------------------------------------------- */
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 40px 20px;
                    background-color: #36393f;
                    color: #dcddde;
                    line-height: 1.6;
                }
    
                .container {
                    max-width: 900px;
                    margin: auto;
                    background: #2f3136;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                }
    
                h1 {
                    color: #7289da;
                    border-bottom: 2px solid #7289da;
                    padding-bottom: 10px;
                    font-size: 2.2rem;
                }
    
                h2 {
                    color: #5865f2;
                    margin-top: 30px;
                    border-bottom: 1px solid #4f545c;
                    padding-bottom: 5px;
                }
    
                p, li {
                    font-size: 1.1rem;
                    color: #dcddde;
                }
    
                code {
                    background-color: #484c52;
                    padding: 3px 6px;
                    border-radius: 4px;
                    font-family: Consolas, 'Courier New', monospace;
                    color: #f2f2f2;
                }
    
                .note {
                    background-color: #3c3a2e;
                    border-left: 5px solid #ffc107;
                    padding: 15px;
                    margin-top: 20px;
                    border-radius: 4px;
                    color: #ffffff;
                }
                .note strong {
                    color: #ffc107;
                }
    
                .command-list {
                    list-style-type: none;
                    padding: 0;
                }
                .command-list li {
                    margin-bottom: 10px;
                    background-color: #3a3d42;
                    padding: 10px;
                    border-radius: 5px;
                }
    
                /* ---------------------------------------------------- */
                /* STYLES DES LIENS & BOUTONS (RÉSOLUTION FINALE) */
                /* ---------------------------------------------------- */
    
                /* 💡 CORRECTION DU PROBLÈME DES BOUTONS : */
                /* On ne met PAS de couleur générale sur 'a', car les .btn sont des 'a' et doivent être blancs. */
                /* On cible uniquement les liens qui sont DANS le conteneur principal ou le footer. */
    
                /* Styles des liens DANS le contenu (main) */
                .container a {
                    text-decoration: underline;
                    color: #7289da; /* Garde la couleur Discord pour les liens normaux */
                }
    
                .lang-switch {
                    text-align: center;
                    margin-bottom: 30px;
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    flex-wrap: wrap;
                }
    
                .btn {
                    display: inline-block;
                    padding: 12px 25px;
                    border-radius: 8px;
                    text-decoration: none !important;
                    font-size: 1rem;
                    font-weight: bold;
                    /* 💡 IMPORTANT : C'est cette règle qui assure que le texte est BLANC sur TOUS les boutons */
                    color: #ffffff;
                    transition: transform 0.2s, background-color 0.2s;
                    border: none;
                    cursor: pointer;
                }
                .btn:hover {
                    transform: translateY(-2px);
                }
    
                .btn-primary {
                    background-color: #5865f2;
                }
                .btn-primary:hover {
                    background-color: #4f5bda;
                }
    
                .btn-secondary {
                    background-color: #4f545c;
                }
                .btn-secondary:hover {
                    background-color: #5d6269;
                }
    
                /* Styles du Footer (Accessibilité Lien OK) */
                footer {
                    background-color: #36393f;
                    text-align: center;
                    margin-top: 50px;
                    padding: 20px 0;
                    color: #99aab5;
                    font-size: 0.9rem;
                }
    
                /* Styles des liens DANS le footer */
                footer a {
                    color: #ffffff; /* Très contrasté sur le fond #36393f (Accessibilité OK) */
                    text-decoration: underline;
                }
    
                footer a:hover {
                    color: #7289da;
                }
    
                hr {
                    border: 0;
                    border-top: 1px solid #4f545c;
                    margin: 40px 0;
                }
    
                ol {
                    padding-left: 20px;
                }
                ol li {
                    margin-bottom: 15px;
                }
                ol ul {
                    list-style-type: disc;
                    padding-left: 20px;
                }
    
            </style>
        </head>
        <body>
    
            <div class="container">
    
                <header>
                    <div class="lang-switch">
                        <a href="/" class="btn btn-secondary">Retour à l'accueil</a>
                        <button onclick="changeLanguage('fr')" class="btn btn-primary">Afficher en Français</button>
                        <button onclick="changeLanguage('en')" class="btn btn-primary">Display in English</button>
                    </div>
                </header>
    
                <main id="content-area">
                </main>
    
            </div>
    
            <footer>
                <p>Ce site est hébergé sur Render. | <a href="https://github.com/kanooob/Logoto" target="_blank">Voir le code source</a></p>
            </footer>
    
            <script>
                // (Votre contenu et vos fonctions de traduction inchangées et fonctionnelles)
                const contentFR = \`
                    <h1>Aide de Logoto - Automatisez votre Logo & Nom ! 🇫🇷</h1>
                    <p>Je suis le bot spécialisé dans l'automatisation du changement de logo ET du nom de votre serveur, sans nécessiter de commandes complexes après la configuration.</p>
    
                    <h2>Les Commandes</h2>
                    <ul class="command-list">
                        <li><code>/setup</code> : Crée les salons nécessaires (Logoto, log-logoto) pour un démarrage rapide.</li>
                        <li><code>/logo-add</code> : Crée un salon de changement de logo avec les options <code>day</code> (jour) et <code>month</code> (mois).</li>
                        <li><code>/name-add</code> : Crée un salon de changement de nom du serveur avec les options <code>day</code> et <code>month</code>.</li>
                        <li><code>/help</code> : Affiche ce message d'aide (ou cette page !).</li>
                        <li><code>/invite</code> : Obtenez le lien pour inviter le bot sur votre serveur.</li>
                        <li><code>/support</code> : Rejoignez le serveur de support pour toute question ou aide.</li>
                    </ul>
    
                    <hr>
    
                    <h2>Système de Changement de Logo Automatique</h2>
                    <p>Le bot surveille des salons spécifiques pour planifier et exécuter les changements de logo. Voici comment le configurer manuellement (ou avec <code>/logo-add</code>) :</p>
    
                    <ol>
                        <li>
                            <strong>Créez le Salon de Planification (Logo) :</strong>
                            <ul>
                                <li>Le nom du salon doit être au format : <code>l-[JOUR]-[MOIS]</code></li>
                                <li>EXEMPLE : Pour un logo le 31 décembre : <code>l-31-12</code></li>
                            </ul>
                        </li>
                        <li>
                            <strong>Préparez le Logo :</strong>
                            <ul>
                                <li>Envoyez votre image de logo sur n'importe quel salon Discord et copiez son lien direct.</li>
                                <li>Le lien doit être une URL d'image valide.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Planifiez le Changement :</strong>
                            <ul>
                                <li>Modifiez le **Sujet du Salon** (Channel Topic) créé à l'étape 1.</li>
                                <li>Collez le **lien** de votre image dans le sujet du salon.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Résultat :</strong>
                            <ul>
                                <li>Le bot changera automatiquement le logo du serveur au jour et au mois spécifiés !</li>
                            </ul>
                        </li>
                    </ol>
    
                    <hr>
    
                    <h2>Système de Changement de Nom Automatique</h2>
                    <p>Le principe est le même pour le nom du serveur (configurable avec <code>/name-add</code>) :</p>
    
                    <ol>
                        <li>
                            <strong>Créez le Salon de Planification (Nom) :</strong>
                            <ul>
                                <li>Le nom du salon doit être au format : <code>n-[JOUR]-[MOIS]</code></li>
                                <li>EXEMPLE : Pour un nom le 1er janvier : <code>n-1-1</code></li>
                            </ul>
                        </li>
                        <li>
                            <strong>Planifiez le Changement :</strong>
                            <ul>
                                <li>Modifiez le **Sujet du Salon** (Channel Topic) créé à l'étape 1.</li>
                                <li>Écrivez le **nouveau nom du serveur** dans le sujet du salon.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Résultat :</strong>
                            <ul>
                                <li>Le bot changera automatiquement le nom du serveur à la date spécifiée !</li>
                            </ul>
                        </li>
                    </ol>
    
                    <div class="note">
                        <strong>NOTE IMPORTANTE :</strong> Pour que le changement automatique fonctionne chaque jour, le salon <code>log-logoto</code> <strong>doit exister</strong>.
                        <br>Chaque jour, le bot envoie un message technique (<code>🔄 (l/n)-Loading</code>) dans ce salon pour déclencher la vérification. C'est ce message qui active ensuite le changement de logo ou de nom si la date correspond.
                        <br>La commande <code>/setup</code> crée automatiquement ce salon pour vous.
                    </div>
                \`;
    
                const contentEN = \`
                    <h1>Logoto Help - Automate your Logo & Name! 🇬🇧</h1>
                    <p>I am the bot specialized in automating the change of your server's logo AND name, without requiring complex commands after the initial setup.</p>
    
                    <h2>Commands</h2>
                    <ul class="command-list">
                        <li><code>/setup</code> : Creates the necessary channels (Logoto, log-logoto) for a quick start.</li>
                        <li><code>/logo-add</code> : Creates a logo change channel with the options <code>day</code> (Required) and <code>month</code> (Required).</li>
                        <li><code>/name-add</code> : Creates a server name change channel with the options <code>day</code> and <code>month</code>.</li>
                        <li><code>/help</code> : Displays this help message (or this page!).</li>
                        <li><code>/invite</code> : Get the link to invite the bot to your server.</li>
                        <li><code>/support</code> : Join the support server for any questions or assistance.</li>
                    </ul>
    
                    <hr>
    
                    <h2>Automatic Logo Change System</h2>
                    <p>The bot monitors specific channels to schedule and execute logo changes. Here's how to configure it manually (or with <code>/logo-add</code>):</p>
    
                    <ol>
                        <li>
                            <strong>Create the Scheduling Channel (Logo):</strong>
                            <ul>
                                <li>The channel name must follow this format: <code>l-[DAY]-[MONTH]</code></li>
                                <li>EXAMPLE: For a logo on December 31st: <code>l-31-12</code></li>
                            </ul>
                        </li>
                        <li>
                            <strong>Prepare the Logo:</strong>
                            <ul>
                                <li>Upload your logo image to any Discord channel and copy its direct link.</li>
                                <li>The link must be a valid image URL.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Schedule the Change:</strong>
                            <ul>
                                <li>Edit the **Channel Topic** of the channel you created in step 1.</li>
                                <li>Paste the **link** of your image into the channel topic.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Result:</strong>
                            <ul>
                                <li>The bot will automatically change the server logo on the day and month specified!</li>
                            </ul>
                        </li>
                    </ol>
    
                    <hr>
    
                    <h2>Automatic Name Change System</h2>
                    <p>The same principle applies for the server name (configurable with <code>/name-add</code>):</p>
    
                    <ol>
                        <li>
                            <strong>Create the Scheduling Channel (Name):</strong>
                            <ul>
                                <li>The channel name must follow this format: <code>n-[DAY]-[MONTH]</code></li>
                                <li>EXAMPLE: For a name on January 1st: <code>n-1-1</code></li>
                            </ul>
                        </li>
                        <li>
                            <strong>Schedule the Change:</strong>
                            <ul>
                                <li>Edit the **Channel Topic** of the channel you created in step 1.</li>
                                <li>Write the **new server name** in the channel topic.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Result:</strong>
                            <ul>
                                <li>The bot will automatically change the server name on the specified date!</li>
                            </ul>
                        </li>
                    </ol>
    
                    <div class="note">
                        <strong>IMPORTANT NOTE:</strong> For the automatic daily change to work, the <code>log-logoto</code> channel <strong>must exist</strong>.
                        <br>Every day, the bot sends a technical message (<code>🔄 (l/n)-Loading</code>) to this channel to trigger the check. This message is what activates the logo or name change if the date matches.
                        <br>The <code>/setup</code> command automatically creates this channel for you.
                    </div>
                \`;
    
                function changeLanguage(lang) {
                    const contentArea = document.getElementById('content-area');
                    if (lang === 'fr') {
                        contentArea.innerHTML = contentFR;
                        document.documentElement.lang = 'fr';
                    } else if (lang === 'en') {
                        contentArea.innerHTML = contentEN;
                        document.documentElement.lang = 'en';
                    }
                    window.scrollTo(0, 0);
                }
    
                document.addEventListener('DOMContentLoaded', () => {
                    changeLanguage('fr');
                });
            </script>
        </body>
        </html>`), { overwrite: true });res.sendFile(S4D_WEBSITECREATION_path.join(__dirname, String('help.html')))
    
      })
      S4D_WEBSITECREATION_EXPRESS_app.all('/', async function(req, res) {
          S4D_APP_write.sync(String('home.html'), String(`<!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="google-site-verification" content="u2mt1kkF8HLYxuULsxpdU7e8dJKFjj0ItJ6IPLcs23s" />
            <title>Logoto - Votre Bot d'Automatisation Discord</title>
            <link rel="icon" type="image/png" href="https://lh3.googleusercontent.com/_kv5f0rdRhClKfzfSL2xgT25oPADwCIPKSZNRMvnnxqh3TYSt8GXq-k2aSKEvxvalHGC0fMD39sNd9RN4e6Rv7U">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #36393f; /* Fond sombre Discord */
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                    box-sizing: border-box;
                }
    
                .container {
                    max-width: 600px;
                    width: 100%;
                }
    
                .icon {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%; /* Icône ronde */
                    margin-bottom: 20px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                }
    
                h1 {
                    font-size: 2.5rem;
                    color: #7289da; /* Bleu Discord */
                    margin-bottom: 10px;
                }
    
                p.description {
                    font-size: 1.2rem;
                    line-height: 1.6;
                    margin-bottom: 30px;
                    color: #dcddde; /* Texte gris clair Discord */
                }
    
                .button-container {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-top: 20px;
                }
    
                .btn {
                    display: inline-block;
                    padding: 15px 30px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 1.1rem;
                    font-weight: bold;
                    color: #ffffff;
                    transition: transform 0.2s, background-color 0.2s;
                }
    
                .btn:hover {
                    transform: translateY(-2px);
                }
    
                .btn-primary {
                    background-color: #5865f2; /* Nouveau bleu Discord */
                }
                .btn-primary:hover {
                    background-color: #4f5bda;
                }
    
                .btn-secondary {
                    background-color: #4f545c; /* Gris bouton Discord */
                }
                .btn-secondary:hover {
                    background-color: #5d6269;
                }
    
                /* Pour les écrans plus larges, mettre les boutons côte à côte */
                @media (min-width: 600px) {
                    .button-container {
                        flex-direction: row;
                        justify-content: center;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://lh3.googleusercontent.com/M8l8KPuNrythRFfTfBmw_5aMdA2qbHGf2wvYE1isX1Y8i9C0lOQy7boyPZVlXGZwu5yOtpM3UlU6nT9kkbv8-KI" alt="Icône du bot Logoto" class="icon">
    
                <h1>Bienvenue sur Logoto</h1>
    
                <p class="description">
                    Automatisez le changement de l'icône et du nom de votre serveur Discord.
                    Planifiez vos modifications pour des événements spéciaux, des saisons ou des célébrations, sans effort !
                </p>
    
                <div class="button-container">
                    <a href="https://discord.com/oauth2/authorize?client_id=1431383390162124920"
                       class="btn btn-primary"
                       target="_blank">
                       Ajouter à Discord
                    </a>
    
                    <a href="/help" class="btn btn-secondary">
                        Comment ça marche ?
                    </a>
                </div>
            </div>
        </body>
        </html>`), { overwrite: true });res.sendFile(S4D_WEBSITECREATION_path.join(__dirname, String('home.html')))
    
      })
      S4D_WEBSITECREATION_EXPRESS_app.all('/robots.txt', async function(req, res) {
          S4D_APP_write.sync(String('robots.txt'), String(`User-agent: *
        Allow: /
        Disallow: /blocks.xml
        Disallow: /index.js
        Sitemap: https://logoto.onrender.com/sitemap.xml`), { overwrite: true });res.sendFile(S4D_WEBSITECREATION_path.join(__dirname, String('robots.txt')))
    
      })
      S4D_WEBSITECREATION_EXPRESS_app.all('/sitemap.xml', async function(req, res) {
          S4D_APP_write.sync(String('sitemap.xml'), String(`<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    
        <url>
          <loc>https://logoto.onrender.com/</loc>
          <priority>1.00</priority>
        </url>
        <url>
          <loc>https://logoto.onrender.com/help</loc>
          <priority>0.80</priority>
        </url>
    
        </urlset>`), { overwrite: true });res.sendFile(S4D_WEBSITECREATION_path.join(__dirname, String('sitemap.xml')))
    
      })
      S4D_WEBSITECREATION_EXPRESS_app.use(function(req, res) {
          S4D_APP_write.sync(String('404.html'), String(`<!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Page Non Trouvée | Logoto</title>
            <link rel="icon" type="image/png" href="https://lh3.googleusercontent.com/_kv5f0rdRhClKfzfSL2xgT25oPADwCIPKSZNRMvnnxqh3TYSt8GXq-k2aSKEvxvalHGC0fMD39sNd9RN4e6Rv7U">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #36393f; /* Fond sombre Discord */
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                    box-sizing: border-box;
                }
    
                .container {
                    max-width: 500px;
                    width: 100%;
                    background: #2f3136; /* Fond intérieur */
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                }
    
                .status-code {
                    font-size: 8rem;
                    font-weight: bold;
                    color: #7289da; /* Bleu Discord */
                    margin-bottom: 5px;
                    line-height: 1;
                }
    
                h1 {
                    font-size: 1.8rem;
                    color: #dcddde;
                    margin-bottom: 20px;
                }
    
                p {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    margin-bottom: 30px;
                    color: #b9bbbe;
                }
    
                .button-container {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-top: 20px;
                }
    
                .btn {
                    display: inline-block;
                    padding: 12px 25px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 1rem;
                    font-weight: bold;
                    color: #ffffff;
                    transition: transform 0.2s, background-color 0.2s;
                }
    
                .btn:hover {
                    transform: translateY(-2px);
                }
    
                .btn-primary {
                    background-color: #5865f2; /* Nouveau bleu Discord */
                }
                .btn-primary:hover {
                    background-color: #4f5bda;
                }
    
                .btn-secondary {
                    background-color: #4f545c; /* Gris bouton Discord */
                }
                .btn-secondary:hover {
                    background-color: #5d6269;
                }
    
                /* Pour les écrans plus larges, mettre les boutons côte à côte */
                @media (min-width: 400px) {
                    .button-container {
                        flex-direction: row;
                        justify-content: center;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="status-code">404</div>
    
                <h1>Oups, cette page a disparu.</h1>
    
                <p>
                    Désolé, mais nous n'avons pas trouvé la page que vous cherchiez.
                    Veuillez utiliser les boutons ci-dessous pour revenir à une zone connue.
                </p>
    
                <div class="button-container">
                    <a href="/" class="btn btn-primary">
                        Retour à l'Accueil
                    </a>
    
                    <a href="/help" class="btn btn-secondary">
                        Accéder à l'Aide
                    </a>
                </div>
            </div>
        </body>
        </html>`), { overwrite: true });res.sendFile(S4D_WEBSITECREATION_path.join(__dirname, String('404.html')))
    
      })
    
    
    S4D_WEBSITECREATION_EXPRESS_app.listen(S4D_APP_WEBSITE_HOSTING_PORT);
    s4d.client.on('messageCreate', async (s4dmessage) => {
      if ((typeof (s4dmessage.guild).channels.cache.find((category) => category.name === (['l-',(new Date().getDate()),'-',((new Date().getMonth())) + 1].join(''))) !== undefined) && ((s4dmessage).content) == '🔄 l-Loading') {
        (s4dmessage.guild).setIcon(((s4dmessage.guild).channels.cache.find((category) => category.name === (['l-',(new Date().getDate()),'-',((new Date().getMonth())) + 1].join(''))).topic),'changement de logo.')
    
        s4dmessage.channel.send({content:String('✅ Logo du serveurs changé.')});
        console.log((['Logo du serveur ',(s4dmessage.guild).name,' (',(s4dmessage.guild).id,').'].join('')));
      }
      if ((typeof (s4dmessage.guild).channels.cache.find((category) => category.name === (['n-',(new Date().getDate()),'-',((new Date().getMonth())) + 1].join(''))) !== undefined) && ((s4dmessage).content) == '🔄 n-Loading') {
        (s4dmessage.guild).setName(((s4dmessage.guild).channels.cache.find((category) => category.name === (['n-',(new Date().getDate()),'-',((new Date().getMonth())) + 1].join(''))).topic),'changement de nom.')
    
        s4dmessage.channel.send({content:String('✅ Nom du serveurs changé.')});
        console.log((['Nom du serveur ',(s4dmessage.guild).name,' (',(s4dmessage.guild).id,').'].join('')));
      }
    
    });
    
    s4d.client.on('guildCreate', async (s4dguild) => {
      s4d.client.channels.cache.get('1432341468059537419').send({content:String((['Bot ajouté dans **',s4dguild.name,'** (',s4dguild.id,').'].join('')))});
    
    });
    
    eventEmitter.on('1', async => {
          s4d.client.guilds.cache.forEach(async (s) =>{
         (s).channels.cache.forEach(async (c) =>{
           if (String(((c).name)).includes(String(([(new Date().getDate()),'-',((new Date().getMonth())) + 1].join(''))))) {
            (s).channels.cache.find((category) => category.name === 'log-logoto').send({content:String((['🔄 ',String(((c).name)).replaceAll((['-',(new Date().getDate()),'-',((new Date().getMonth())) + 1].join('')), String('-')),'Loading'].join('')))});
          }
          await delay(Number(1)*1000);
    
        })
    
      })
    
      });
    
    return s4d
})();