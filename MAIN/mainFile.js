
const Discord = new require('discord.js');
const clientBot = new Discord.Client();


const startCommand = /^\-.+/;


clientBot.once('ready', () => {
    console.log("ALATEKA's BOT is online");
});


clientBot.on('message', message => {

    const messageUser = message.content;

    if (startCommand.test(messageUser)) {

        switch ( messageUser.substring(1).toLowerCase()) {

            case  'quien eres':
                message.channel.send('Soy la mascota de VTC CrisTiger');
                break;

            case 'normas':
                const rulesCart = new Discord.MessageEmbed()
                .setColor('#0099ff')
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

            default:
                break;
        }
    }
});

function getUserNameByID(id)
{
    if ( ! clientBot.users.cache.get(id) ) {
        return createMessageError('No se encontro ningún usuario');
    }
    return clientBot.users.cache.get(id);
}

function createMessageError(text)
{
    return '==> ERROR: ' + text;
}

clientBot.login('Nzg0MzU0NTQ5MDk1MjAyODI2.X8oFGQ.RfKzhUiqAL-attu4pGm8Mw2hQ_g');