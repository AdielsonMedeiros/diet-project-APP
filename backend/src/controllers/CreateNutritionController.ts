import { FastifyRequest, FastifyReply } from 'fastify'
import { CreateNutritionService } from '../services/CreateNutritionService'

export interface DataProps {
    name: string
    weight: string
    height: string
    age: string
    gender: string
    objective: string
    level: string
}

class CreateNutritionController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { name, weight, height, age, gender, objective, level } = request.body as DataProps;

        // Adiciona o bloco try para a lógica principal
        try {
            const createNutrition = new CreateNutritionService();
            const nutrition = await createNutrition.execute({
                name,
                weight,
                height,
                age,
                gender,
                objective,
                level,
            });

            // Se tudo der certo, envia a resposta de sucesso
            return reply.send(nutrition);

        } catch (error: any) { // Captura qualquer erro que aconteça no bloco 'try'
            console.error("ERRO NO CONTROLLER:", error); // É bom logar o erro no servidor

            // Verifica se o erro é o 503 (Serviço Indisponível) da API do Google
            if (error.status === 503) {
                // Envia uma resposta específica para o app
                return reply.status(503).send({ 
                    error: "O serviço de IA está sobrecarregado. Por favor, tente novamente em alguns instantes." 
                });
            }

            // Para qualquer outro tipo de erro, envia uma resposta de erro genérica
            return reply.status(400).send({ 
                error: error.message || "Não foi possível processar sua solicitação." 
            });
        }
    }
}

export { CreateNutritionController }