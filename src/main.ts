import './style.css';
import { Application } from "@hotwired/stimulus";
import ChaosGameController from './controllers/chaos-game-controller';


const application = Application.start()
application.register("chaos-game", ChaosGameController);