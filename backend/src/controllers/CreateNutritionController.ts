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

                
                return reply.send(nutrition);

            } catch (error: any) {
                console.error("ERRO NO CONTROLLER:", error);

                
                if (error.status === 503) {
                    
                    return reply.status(503).send({
                        error: "O serviço de IA está sobrecarregado. Por favor, tente novamente em alguns instantes."
                    });
                }

                
                return reply.status(400).send({
                    error: error.message || "Não foi possível processar sua solicitação."
                });
            }
        }
    }

    export { CreateNutritionController }