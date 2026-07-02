import { ai, goalSuggestionSchema } from "../config/gemini";
import { AppError } from "../errors/AppError";

interface GoalSuggestion {
  goal: {
    title: string;
    description: string;
    type: "quantitative" | "qualitative";
    target_value: number | null;
  };
  tasks: { title: string; description: string }[];
  habits: { title: string; description: string }[];
}

async function suggestGoal(
  description: string,
  previousSuggestion?: GoalSuggestion,
  refinementRequest?: string,
): Promise<GoalSuggestion> {
  let prompt = `Você é um assistente de produtividade especializado em quebrar metas em ações concretas.

O usuário descreveu a seguinte meta: "${description}"

Analise essa meta e:
1. Decida se é QUANTITATIVA (tem um número mensurável de progresso, ex: "correr 42km", "ler 12 livros") ou QUALITATIVA (não tem número claro, ex: "aprender React", "melhorar minha saúde mental")
2. Se for quantitativa, defina um target_value numérico razoável
3. Sugira entre 1 e 5 tarefas concretas (ações pontuais que terminam) que ajudem a alcançar a meta
4. Sugira entre 0 e 3 hábitos (ações recorrentes que se repetem) que ajudem a alcançar a meta
5. Escreva title curto e description explicativa para a meta, tarefas e hábitos
6. Responda em português`;

  if (previousSuggestion && refinementRequest) {
    prompt += `

Você já sugeriu isso anteriormente:
${JSON.stringify(previousSuggestion, null, 2)}

O usuário pediu o seguinte ajuste: "${refinementRequest}"

Gere uma nova sugestão considerando esse ajuste.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: goalSuggestionSchema,
      },
    });

    const text = response.text;
    if (!text) throw new AppError("A IA não retornou uma resposta.", 502);

    return JSON.parse(text) as GoalSuggestion;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Erro ao gerar sugestão com IA.", 502);
  }
}

export const aiService = { suggestGoal };
