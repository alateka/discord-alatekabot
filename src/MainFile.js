const Discord = require('discord.js');
const clientBot = new Discord.Client();
const config = require('../config.json');
clientBot.login(config.token);
const fetch = require("node-fetch");

const date = new Date();

const startCommand = /^\-.+/;
const cal = /^\-[1-9][0-9]*(\-|\+|\*|\/)[1-9][0-9]*$/;
const pelisQueryExp = /^(-pelis populares$|-pelis buscar .+)$/;

//  PELIS API
const BASEURL_PELIS='https://api.themoviedb.org/3/'

clientBot.once('ready', () => {
    console.log("ALATEKA's BOT is online");
});

clientBot.on('message', message => {

    const userMessage = message.content;

    const dataUser = userMessage.split(" ");

    if ( pelisQueryExp.test(userMessage) ) {

        let find = dataUser.slice(2).join(" ");

        let URL = dataUser[1] == 'populares' ?
            BASEURL_PELIS+'discover/movie?sort_by=popularity.desc&api_key='+config.PELIS_API_KEY+'&language=es-MX&page=1'
            : BASEURL_PELIS+'search/movie?api_key='+config.PELIS_API_KEY+'&language=es-MX&query='+find+'&page=1';

        fetch(URL)
            .then(response => response.json())
            .then(({results}) => {
                let pelisArray = [];
                pelisArray = results.map(p => {
                    p.poster_path = `https://image.tmdb.org/t/p/w185_and_h278_bestv2${p.poster_path}`
                    p.like = false
                    return p
                }).slice(0,5);

                console.log(
                    '\n===========================================\n'
                    +'-----( New data )-----'
                    + '\n===========================================\n'
                    +'URI ==> '+ URL+'\n'+'Pelis ==> '+pelisArray+'\n'+'Count ==> '+pelisArray.length);

               for ( let i=0; i<pelisArray.length; i++ ) {
                    let pelisTable = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Bién, encontré '+(i+1)+' de '+pelisArray.length+' resultados.')
                        .addFields(
                            { name: 'Película: ', value: '- '+pelisArray[i].original_title },
                            { name: 'Resumen: ', value: '- '+pelisArray[i].overview }
                        )
                        .setTimestamp()
                        .setImage(pelisArray[i].poster_path)
                        .setFooter('PELICULAS');
                    message.channel.send(pelisTable);
               }
            });
    }

    if (startCommand.test(userMessage)) {

        switch ( userMessage.substring(1).toLowerCase()) {

            case 'comandos':
                const commandList = new Discord.MessageEmbed()
                .setColor('#36a347')
                .setTitle('Listado de comandos disponibles del BOT de ALATEKA:')
                .addFields(
                    { name: '( -quien eres )', value: 'Muestra información sobre este BOT'
                    +'\n.'
                    },
                    { name: '( -normas )', value: 'Muestra el listado de normas que se debe respetar en este servidor'
                    +'\n.'
                    },
                    { name: '( -avatar )', value: 'Muestra la imagen de tu perfil de Discord'
                    +'\n.'
                    },
                    { name: '( -nombre )', value: 'Muestra tu nombre de usuario en Discord, por si a caso \n ni tu mismo sabes quién eres'
                    +'\n.'
                    },
                    { name: '( -[xx]operación[xx] )', value: 'Este bot es también una calculadora simple, sustituye xx por'
                    +'los numeros a calcular. \nEjemplo: 357+159 | 51/9 | 517*379 | 9-5'
                    +'\n.'
                    },
                    { name: '( -pelis buscar "nombre película" )', value: 'Sirve para buscar películas y obtener información sobre las mismas.' 
                    +'\n Ejemplo:  -pelis buscar Iron Man'
                    +'\n.'
                    },
                    { name: '( -pelis populares )', value: 'Obtienes un listado de las 5 mejores películas actualmente. "Según themoviedb.org"'
                    +'\n.'
                    },
                )
                .setImage('https://i.imgur.com/mKFkZA6.png')
                .setFooter("ALATEKA's_Bot - v01052021beta");
                message.channel.send(commandList);
                break;

            case  'quien eres':
                message.channel.send('Soy un BOT idiota. ¿Es que no lo ves? \n Pero también soy el puto amo.');
                break;

            case 'normas':
                const rulesCart = new Discord.MessageEmbed()
                .setColor('#36a347')
                .setTitle('Normas del servidor:')
                .addFields(
                    { name: 'Regla 1º', value: 'Respeta a todos los usuarios.' },
                    { name: 'Regla 2º', value: 'Cualquier warn se pondrá tras hablarlo entre los 2 moderadores y el Creador' },
                    { name: 'Regla 3º', value: 'No se aceptará ninguna falta de respeto hacia nadie.' },
                )
                .setTimestamp()
                .setImage('https://cdn.discordapp.com/attachments/779069086210064385/779098910479876106/1605822045699.png')
                .setFooter('NORMAS');
                message.channel.send(rulesCart);
                break;

            case 'avatar':
                message.reply('\n No se para que quieres una imagen de tu avatar, pero toma: \n'+message.author.displayAvatarURL());
                break;

            case 'nombre':
                message.reply('\n Tu nombre es: \n ==>  '+message.author.username+'  <==');
                break;

            default:
                if ( cal.test(userMessage) ) {
                    message.channel.send('==>\t' + getResultByOperator(userMessage) );
                }
                break;
        }
    }
});

function getResultByOperator(userMessage)
{
    if ( userMessage.indexOf('*') != -1 ) {
        const valores = userMessage.substring(1).split('*');
        return parseInt(valores[0])*parseInt(valores[1]);
    }
    if ( userMessage.indexOf('/') != -1 ) {
        const valores = userMessage.substring(1).split('/');
        return parseInt(valores[0])/parseInt(valores[1]);
    }
    if ( userMessage.indexOf('+') != -1 ) {
        const valores = userMessage.substring(1).split('+');
        if ( valores[0] == "1" && valores[1] == "1" ) {
            return "Eres tonto, o te falta poco";
        } else { 
            return parseInt(valores[0])+parseInt(valores[1]);
        }
    }
    if ( userMessage.indexOf('-') != -1 ) {
        const valores = userMessage.substring(1).split('-');
        if ( valores[0] == "1" && valores[1] == "1" ) {
            return "LLegastes a ir al colegio ¿Verdad?";
        } else { 
            return parseInt(valores[0])-parseInt(valores[1]);
        }
    }
}

function createErrorMessage(text)
{
    return '==> ERROR: ' + text;
}
