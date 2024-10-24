import {getCompletion} from "@/openAiServices";
import {generateText} from "@/palm2Services"

const generatePrompt = (userData) => {
	return `
		На основі даних користувача, наведених нижче, складіть план тренувань на тиждень.
		Дані користувача:
		${JSON.stringify(userData)}
		
		Згенеруйте 3 вправи на день.
		Субота та неділя - вихідні дні.
		
		Приклад вихідного JSON:
		[{«day»: «Monday», “exercises”: [{ «exercise»: «...», “sets”: «...», “reps”: «...», “weight”: «...», “rest”: «..."}]}]
		
		«reps» у JSON - рядок з кількістю повторень з вагою, якщо потрібно
		«rest» у JSON - відпочинок між підходами
		«weight» в JSON - це вага, яка буде використовуватися для вправи, вона повинна бути з одиницями, якщо потрібно, наприклад, 10 фунтів, інакше зробіть це »---»
		
		Для днів відпочинку поверніть лише один об'єкт javascript у масиві exercises з полем вправи «День відпочинку», а решта полів - «---»
		
		Створюйте все виключно українською мовою!
		
		Відповідь:
	`
}

export default async function handler(req, res) {

	try {
		if (req.method === 'POST') {
			let result;
			const {
				height,
				weight,
				age,
				gender,
				fitnessLevel,
				goal,
				model,
			} = req.body

			// generate the prompt
			const prompt = generatePrompt({height, weight, age, gender, fitnessLevel, goal})

			if (model.toLowerCase() === 'openai') {
				result = await getCompletion(prompt)
			} else {
				// PaLM API
				result = await generateText(prompt)
			}

			return res.json({result})
		} else {
			// Handle other HTTP methods or return an appropriate error response
			return res.status(405).json({error: 'Method Not Allowed'});
		}
	} catch (e) {
		return res.status(405).json({error: e.message});
	}

}
