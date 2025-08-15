import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";
import { DataProps } from "../controllers/CreateNutritionController";

class CreateNutritionService {
  async execute({
    name, // <-- 1. O nome que o usuário digitou no input chega aqui
    age,
    gender,
    height,
    level,
    objective,
    weight,
  }: DataProps) {
    // ✅ MUDANÇA: Adicionada validação para garantir que o nome não está vazio.
    if (!name || name.trim() === "") {
      throw new Error("O nome do usuário não foi fornecido ou está vazio.");
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

      const generationConfig: GenerationConfig = {
        responseMimeType: "application/json",
      };

      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig 
      });

      // 2. O prompt para a IA agora NÃO pede o campo "nome".
      //    Isso evita que a IA se confunda.
      const prompt = `
        Crie uma dieta completa para uma pessoa com os seguintes dados:
        - Sexo: ${gender}
        - Peso: ${weight}kg
        - Altura: ${height}cm
        - Idade: ${age} anos
        - Objetivo: ${objective}
        - Nível de atividade: ${level}

        A resposta DEVE SEGUIR ESTRITAMENTE a seguinte estrutura JSON.

        Exemplo da estrutura esperada:
        {
          "sexo": "${gender}",
          "idade": ${age},
          "altura": ${height},
          "peso": ${weight},
          "objetivo": "${objective}",
          "refeicoes": [
            {
              "nome": "Café da Manhã",
              "horario": "07:00",
              "composicao": [
                { "alimento": "Ovo mexido", "quantidade": "3 unidades" },
                { "alimento": "Pão Integral", "quantidade": "1 fatia" }
              ]
            }
          ],
          "suplementos": [
            "Whey Protein",
            "Creatina"
          ],
          "taxa_metabolica_basal_diario": 1700,
          "gasto_metabolico_basal": 2100
        }

        Retorne apenas o objeto JSON puro, sem formatação de markdown, comentários ou texto adicional.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const jsonText = response.text();
      
      // 3. A resposta da IA é convertida para um objeto JSON.
      const jsonObject = JSON.parse(jsonText);

      // 4. AQUI ESTÁ A PARTE MAIS IMPORTANTE:
      //    Nós adicionamos manualmente o nome (que veio do input) ao objeto.
      jsonObject.nome = name;

      // 5. O resultado final é retornado com a dieta E o nome correto do usuário.
      return { data: jsonObject };

    } catch (error) {
      console.error("ERRO NO SERVIÇO (API DO GOOGLE):", error);
      throw error; 
    }
  }
}

export { CreateNutritionService };
