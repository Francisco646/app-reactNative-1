/* INDEX.JS - Punto de entrada al servidor de express */

/* Importar dependencias importantes */
const express = require('express');
const cors = require('cors');

/* Inicializar el servidor */
const app = express();
const PORT = process.env.PORT || 3000;

/* Permitir el uso de dependencias importadas */
app.use(cors());
app.use(express.json());

/* Importar rutas */
const RegisterRoutes = require('./register/register.routes');
const LoginRoutes = require('./login/login.routes');
const RewardRoutes = require('./rewards/reward.routes');
const SettingRoutes = require('./settings/setting.routes');
const HistoryRoutes = require('./history/history.routes');
const CalendarRoutes = require('./calendar/calendar.routes');
const ActivitiesRoutes = require('./activities/activities.routes');
const RoutinesRoutes = require('./routines/routines.routes');
const PlansRoutes = require('./plans/plans.routes');

/* Inicializar rutas */
const registerRoutes = new RegisterRoutes();
const loginRoutes = new LoginRoutes();
const rewardRoutes = new RewardRoutes();
const settingRoutes = new SettingRoutes();
const historyRoutes = new HistoryRoutes();
const calendarRoutes = new CalendarRoutes();
const activitiesRoutes = new ActivitiesRoutes();
const routinesRoutes = new RoutinesRoutes();
const plansRoutes = new PlansRoutes();

/* Habilitar uso de rutas */
app.use('/register', registerRoutes.getRouter());
app.use('/login', loginRoutes.getRouter());
app.use('/reward', rewardRoutes.getRouter());
app.use('/setting', settingRoutes.getRouter());
app.use('/history', historyRoutes.getRouter());
app.use('/calendar', calendarRoutes.getRouter());
app.use('/activity', activitiesRoutes.getRouter());
app.use('/routine', routinesRoutes.getRouter());
app.use('/plan', plansRoutes.getRouter());

/* Abrir servidor */
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
