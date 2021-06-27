
// Переменные, которые нам потребуются для работы
let videostream;
let labelBox;
let mlModel;
let newClassifier;

let duckButton;
let penButton;
let trainBurron;

function setup() {
    console.log('Setup JS application');

    // Указываем библиотеке, что нам не потребуется канвас для нашего примера
    noCanvas();

    // Получаем видеопоток с основной камеры телефона камеры и выводим его на страницу
    videostream = createCapture({
      audio: false,
      video: {
        facingMode: {
          exact: "environment"
        }
      }
    });
    // videostream = createCapture('video');

    // Создаем элемент, в котором будем рисовать предсказание
    labelBox = createElement('h2', 'Prediction');

    // Загружаем уже предобученный MobileNet и отрезаем от него последний слой
    // После загрузки вызовется modelReady
    mlModel = ml5.featureExtractor('MobileNet', modelReady);

    // Создаем на базе предыдущей модели новую для классификации
    // Сразу соединяем ее с видеопотоком
    newClassifier  = mlModel.classification(videostream);

    // Кнопка для добавления примера уточки
    duckButton = createButton('Duck');
    duckButton.mousePressed(function() {
      console.log("Added Duck");
      newClassifier.addImage('Duck');
    });

    // Кнопка для добавления примера ручка
    whistleButton = createButton('Pen');
    whistleButton.mousePressed(function() {
      console.log("Added Pen");
      newClassifier.addImage('Pen');
    });

    // Кнопка для начала обучения
    trainButton = createButton('Train');
    trainButton.mousePressed(function() {
      console.log("Begin training");
      newClassifier.train(controlTraining);
    });
}

function controlTraining(loss) {
  if (loss) {  // Еще идет процесс обучения
    console.log(loss);
  } else { // Процесс обучения завершился. Можем начинать предсказания
    newClassifier.classify(drawPrediction);
  }
}

function modelReady() {
    console.log('Model is ready to make predictions');
}

function drawPrediction(error, result) {
  if (!error) {
    // Отображаем предсказание
    prediction = result[0]['label'];
    probability = result[0]['confidence'];
    labelBox.html(prediction + " - " + probability);

    // Передаем следующий кадр в обработку модели
    newClassifier.classify(drawPrediction);
  }
}