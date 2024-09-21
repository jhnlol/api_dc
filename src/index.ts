import express, { Application, Request, Response } from 'express';
import Bot from './bot';
import Config from './Config';
class App {
    public app: Application;
    private bot: Bot;

    constructor() {
        const token = Config.TOKEN;
        const guildId = Config.GUILD_ID;
        this.app = express();
        this.initializeMiddlewares();
        this.bot = new Bot(token, guildId);
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
    }

    public listen() {
        this.app.get('/', (req: Request, res: Response) => {
            res.send('What are you doing here?');
        });

        this.app.get('/user/:id', async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                const user = await this.bot.getUserInfo(id);
                if (user) {
                    res.send(user);
                } else {
                    res.status(404).send('User not found');
                }
            } catch (error) {
                res.status(500).send('Error fetching user');
            }
        });

        const port = process.env.PORT || 3000;
        this.app.listen(port, () => {
            console.log(`App listening on port ${port}!`);
        });
    }
}

const app = new App();
app.listen();
