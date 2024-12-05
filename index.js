const apiURL = "https://raw.githubusercontent.com/cesarmcuellar/CuestionarioWeb/refs/heads/main/cuestionario.json";
const questionContainer = document.getElementById('question-container');
const btn = document.getElementById('btn');
const mostrarResultado = document.getElementById('result');

let questions = [];

async function obtenerPreguntas() {
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(` status: ${response.status}`);
    }
    const data = await response.json();

    
    if (!data.multiple_choice_questions || !data.true_false_questions) {
    }

    questions = [...data.multiple_choice_questions, ...data.true_false_questions];
    arrays(questions);
    preguntas();
  } catch (error) {
    console.error("Error fetching questions:", error);
    questionContainer.innerHTML = `<p>Hubo un error al cargar las preguntas. Intenta nuevamente más tarde.</p>`;
  }
}
  function arrays(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = ~~(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

function preguntas() {
  questionContainer.innerHTML = ""; 
  questions.forEach((q, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = "question";

    questionDiv.innerHTML = `
      <p>${index + 1}. ${q.question}</p>
    `;

    if (q.options) {
      
      q.options.forEach((option) => {
        questionDiv.innerHTML += `
          <label>
            <input type="radio" name="question-${index}" value="${option}">
            ${option}
          </label><br>
        `;
      });
    } else {
      
      questionDiv.innerHTML += `
        <label>
          <input type="radio" name="question-${index}" value="true"> Verdadero
        </label><br>
        <label>
          <input type="radio" name="question-${index}" value="false"> Falso
        </label><br>
      `;
    }

    questionContainer.appendChild(questionDiv);
  });

  btn.style.display = "block";
}


function showResult() {
  let Corretas = 0;
  let inCorretas = 0;
  let sinResp = 0;

  questions.forEach((q, index) => {
    const selecPregunta = document.querySelector(`input[name="question-${index}"]:checked`);
    if (selecPregunta) {
      if (selecPregunta.value === q.Corretas_answer) {
        Corretas++;
      } else {
        inCorretas++;
      }
    } else {
      sinResp++;
    }
  });

  if (sinResp > 0) {
    alert(`Por favor responde todas las preguntas ($sinResp} sin responder).`);
    return;
  }

  const total = questions.length;
  const porcentageCo = Math.round((Corretas / total) * 100 * 100) / 100; 
  const incentage = Math.round((inCorretas / total) * 100 * 100) / 100; 
  

  alert(`
    Resultados:
    - Corretas: ${Corretas} (${porcentageCo}%)
    - Incorrect: ${inCorretas} (${incentage}%)
    - Total: ${total}
  `);



  mostrarResultado.textContent = `Tu puntuación es: ${correct}/${total} (${porcentageCo}% correctas)`;
}

btn.addEventListener('click', showResult);


obtenerPreguntas();