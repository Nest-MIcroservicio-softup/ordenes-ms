import 'dotenv/config';
import * as joi from 'joi';


interface EnvVars {
    PORT: number;
    //PRODUCT_MICROSERVICE_HOST:string
    //PRODUCT_MICROSERVICE_PORT:number
    //DATABASE_URL: string;
    NATS_SERVERS: string[];
}

const envVarsSchema: joi.ObjectSchema = joi.object({
    PORT: joi.number().required().default(3000),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    //PRODUCT_MICROSERVICE_HOST:joi.string().required(),
    //PRODUCT_MICROSERVICE_PORT:joi.number().required()
})
.unknown(true);

const { error, value } = envVarsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port :envVars.PORT,
    natsServers: envVars.NATS_SERVERS,
    //productMicroserviceHost:envVars.PRODUCT_MICROSERVICE_HOST,
    //productMicroservicePort:envVars.PRODUCT_MICROSERVICE_PORT
}