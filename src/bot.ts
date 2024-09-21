import { Client, GatewayIntentBits, Guild, GuildMember } from 'discord.js';
import { IGetUser } from './Types';

class Bot {
    private client: Client;
    private token: string;
    private guildId: string;

    constructor(token: string, guildId: string) {
        this.token = token;
        this.client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildPresences,
        ],
        });
        this.guildId = guildId;
        this.initialize();
    }

    private initialize() {
        this.client.login(this.token);

        this.client.once('ready', () => {
            console.log('Bot is ready!');
        });
    }
    public async getUserInfo(id: string): Promise<IGetUser | null> {
        try {
            const guild: Guild | undefined = await this.client.guilds.fetch(this.guildId);
            if (!guild) {
                throw new Error('Guild not found');
            }
            const member: GuildMember | null = await guild.members.fetch(id);
            if (!member) {
                throw new Error('Member not found');
            }
            const user = member.user;
            const presence = member.presence || { status: 'offline', activities: [] };
            return {
                username: user.username,
                id: user.id,
                avatar: user.displayAvatarURL(),
                status: presence.status,
            };
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }
    }
}

export default Bot;
