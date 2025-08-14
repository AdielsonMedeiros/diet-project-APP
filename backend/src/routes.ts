import {
    FastifyInstance,
    FastifyPluginOptions,
    FastifyRequest,
    FastifyReply
} from 'fastify'

import { CreateNutritionController } from './controllers/CreateNutritionController'


export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions){


    fastify.get("/teste", (request: FastifyRequest, reply: FastifyReply) => {
        
        let responseText = "```json\n{\n  \"nome\": \"Ad\",\n  \"sexo\": \"Masculino\",\n  \"idade\": 28,\n  \"altura\": 1.80,\n  \"peso\": 95,\n  \"objetivo\": \"Hipertrofia\",\n  \"refeicoes\": [\n    {\n      \"horario\": \"7:00\",\n      \"nome\": \"Cafe da manha\",\n      \"alimentos\": [\n        \"300g de aveia\",\n        \"200ml de leite desnatado\",\n        \"1 banana\",\n        \"1 colher de sopa de pasta de amendoim\"\n      ]\n    },\n    {\n      \"horario\": \"10:00\",\n      \"nome\": \"Lanche da manha\",\n      \"alimentos\": [\n        \"150g de iogurte grego\",\n        \"50g de frutas vermelhas\"\n      ]\n    },\n    {\n      \"horario\": \"13:00\",\n      \"nome\": \"Almoco\",\n      \"alimentos\": [\n        \"200g de frango grelhado\",\n        \"150g de arroz integral\",\n        \"200g de brócolis\",\n        \"1 colher de sopa de azeite\"\n      ]\n    },\n    {\n      \"horario\": \"16:00\",\n      \"nome\": \"Lanche da tarde\",\n      \"alimentos\": [\n        \"1 copo de shake de proteina (whey protein)\",\n        \"1 fatia de mamão\"\n      ]\n    },\n    {\n      \"horario\": \"19:00\",\n      \"nome\": \"Jantar\",\n      \"alimentos\": [\n        \"150g de carne vermelha magra\",\n        \"100g de batata doce\",\n        \"100g de salada verde\"\n      ]\n    },\n    {\n      \"horario\": \"21:00\",\n      \"nome\": \"Ceia\",\n      \"alimentos\": [\n        \"100g de iogurte desnatado com 20g de granola\"\n      ]\n    }\n  ],\n  \"suplementos\": [\n    \"Whey protein\",\n    \"Creatina\",\n    \"BCAA\"\n  ]\n}\n```"
    
        try{

            let jsonString = responseText.replace(/```\w*\n/g, ''). replace(/\```/g, '').trim();
            let jsonObject = JSON.parse(jsonString);

            return reply.send({data:jsonObject})
            
        }catch(e) {
            console.log(e)
        }
    })

    fastify.post("/create",(request: FastifyRequest, reply: FastifyReply)=> {
        return new CreateNutritionController().handle(request, reply)
    })

    

}