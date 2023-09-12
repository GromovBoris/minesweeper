// ЗАНИМАЮСЬ ЕРУНДОЙ, ПОТОМ ПЕРЕДЕЛАТЬ
const body = document.querySelector("body");
body.insertAdjacentHTML(
  "afterbegin",
  '    <div class="wrapper"><div class="screenview"><div class="nav"><div class="nav__fieldsize"><fieldset class="nav__fieldsize__field"><div class="nav__fieldsize__field-item"><input type="radio" id="easy" name="gridsize" value="10" checked /> <label for="easy">РЯДОВОЙ</label> </div>          <div class="nav__fieldsize__field-item">            <input type="radio" id="normal" name="gridsize" value="15" />            <label for="normal">ГЕНЕРАЛ</label>          </div>          <div class="nav__fieldsize__field-item">            <input type="radio" id="hard" name="gridsize" value="25" />            <label for="hard">ПЁС ПАТРОН</label>          </div>        </fieldset>      </div>      <div class="nav__newgame">        <button class="startgame">НАЧАТЬ ИГРУ</button>      </div>      <div class="nav__difflevel">        <p>МИНЫ <output id="value"></output></p>        <input          id="pi_input"          type="range"          name="countsize"          value="10"          min="10"          max="99"          step="1"        />      </div>    </div>    <div class="field disabledview"></div>    <div class="records">      <div class="time disabled">        <p>ТАЙМЕР<span class="timer">00:00</span></p>      </div>      <div class="record">10 ПОСЛЕДНИХ РЕЗУЛЬТАТОВ</div>      <div class="click disabled">        <p>КЛИКИ<span class="clicks">00</span></p>      </div>    </div>  </div></div>'
);

// КОНСТАНЦИЯ БОНАСЬЕ

const value = document.getElementById("value");
const timecount = document.querySelector(".time");
const input = document.getElementById("pi_input");
const container = document.querySelector(".field");
const clickcount = document.querySelector(".click");
const clicktablo = document.querySelector(".clicks");
const cellclick = document.querySelectorAll(".cell");
const startbutton = document.querySelector(".startgame");
const gamestart = document.querySelector(".nav__newgame");
const difflevel = document.querySelector(".nav__difflevel");
const fieldsize = document.querySelector(".nav__fieldsize");

//БАЗОВЫЕ ЗНАЧЕНИЯ МАТРИЦЫ И ГЕНЕРАЦИЯ БАЗОВОЙ МАТРИЦЫ ПРИ ЗАГРУЗКЕ

let minesvalue = 10;
let matrixsize = 10;
generateMatrix(10, 10);

// СЧИТЫВАЕМ КОЛИЧЕСТВО БОМБ И ФОРМИРОВАВНИЕ ИГРОВОГО ПОЛЯ

input.addEventListener("input", (event) => {
  value.textContent = event.target.value;
  minesvalue = event.target.value;
  generateMatrix(matrixsize, minesvalue);
});

//СЧИТЫВАНИЕ РАЗМЕРА И ФОРМИРОВАНИЕ ИГРОВОГО ПОЛЯ

document.getElementById("easy").addEventListener("click", function () {
  matrixsize = 10;
  container.style.gridTemplateRows = "repeat(10, 1fr)";
  container.style.gridTemplateColumns = "repeat(10, 1fr)";
  generateMatrix(matrixsize, minesvalue);
});

document.getElementById("normal").addEventListener("click", function () {
  matrixsize = 15;
  container.style.gridTemplateRows = "repeat(15, 1fr)";
  container.style.gridTemplateColumns = "repeat(15, 1fr)";
  generateMatrix(matrixsize, minesvalue);
});

document.getElementById("hard").addEventListener("click", function () {
  matrixsize = 25;
  container.style.gridTemplateRows = "repeat(25, 1fr)";
  container.style.gridTemplateColumns = "repeat(25, 1fr)";
  generateMatrix(matrixsize, minesvalue);
});

// ГЕНЕРИРУЕМ МАТРИЦУ НА ОСНОВЕ ТЕКУЩЕГО УРОВНЯ СЛОЖНОСТИ И РАЗМЕРА ПОЛЯ

function generateMatrix(size, minesqua) {
  const matrix = [];
  for (let i = 0; i < size; i++) {
    matrix.push([]);
    for (let j = 0; j < size; j++) {
      matrix[i].push(0);
    }
  }
  let count = minesqua;
  while (count > 0) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    if (matrix[row][col] === 0) {
      matrix[row][col] = 1;
      count--;
    }
  }
  container.innerHTML = "";
  generateGrid(matrix);
}

// ФОРМИРУЕМ GRID НА ОСНОВЕ MATRIX, ЗАКРЫВАЕМ И ВСТАВЛЯЕМ В DOM

function generateGrid(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const cellcont = document.createElement("div");
      const cell = document.createElement("div");
      const overlay = document.createElement("div");
      cellcont.classList.add("cellcontainer");
      overlay.classList.add("overlay");
      cell.classList.add("cell");
      cellcont.appendChild(cell);
      cellcont.appendChild(overlay);
      if (matrix[i][j] === 1) {
        cell.classList.add("bomb");
      } else {
        const count = countNearbyBombs(matrix, i, j);
        if (count > 0) {
          cell.textContent = count;
          cell.classList.add(`number-${count}`);
          cell.classList.add("number");
        } else {
          cell.classList.add("empty");
        }
      }
      container.appendChild(cellcont);
    }
  }
}

// СЧИТАЕМ БОМБЫ ВОКРУГ

function countNearbyBombs(matrix, row, col) {
  let count = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (
        i >= 0 &&
        i < matrix.length &&
        j >= 0 &&
        j < matrix[i].length &&
        matrix[i][j] === 1
      ) {
        count++;
      }
    }
  }
  return count;
}
// СЧИТЫВАЕМ КЛИК ПО ЯЧЕЙКЕ ПОЛЯ

function startgame() {
  // let mines = minesvalue;
  let clicknumber = 0;
  // let seconds = 0;
  // alert(matrix);
  const cellconts = document.querySelectorAll(".overlay");
  cellconts.forEach((cellcont) => {
    cellcont.addEventListener("click", (event) => {
      clicknumber = clicknumber + 1;
      clicktablo.textContent = `${clicknumber}`;
      const clickedCell = event.target.closest(".overlay");
      const cellIndex = Array.from(
        document.querySelectorAll(".overlay")
      ).indexOf(clickedCell);
      const cell = document.querySelectorAll(".cell")[cellIndex];
      if (cell.classList.contains("bomb")) {
        // openMines();
        alert("Подсоберись, поехали заново");
        startbutton.click();
      }
      cell.classList.remove("cell");
      cell.classList.add("newcell");
      clickedCell.classList.remove("overlay");
      clickedCell.classList.add("open");
    });
  });
}

// ЗАПУСК ИКРЫ

startbutton.addEventListener("click", () => {
  if (startbutton.textContent === "НАЧАТЬ ИГРУ") {
    timer();
    startgame();
    startbutton.textContent = "ИГРАТЬ ЗАНОВО";
    container.classList.toggle("disabledview");
    timecount.classList.toggle("disabled");
    clickcount.classList.toggle("disabled");
    difflevel.classList.toggle("disabled");
    fieldsize.classList.toggle("disabled");
  } else {
    stopTimer();
    generateMatrix(matrixsize, minesvalue);
    startbutton.textContent = "НАЧАТЬ ИГРУ";
    container.classList.toggle("disabledview");
    timecount.classList.toggle("disabled");
    clickcount.classList.toggle("disabled");
    difflevel.classList.toggle("disabled");
    fieldsize.classList.toggle("disabled");
  }
});

// ПРОВЕРЯЕМ НА НАЛИЧИЕ ПУСТЫХ ЯЧЕЕК РЯДОМ И ОКТРЫВАЕМ ИХ

// function lookingNeighbors(row, col, matrix) {
//   const neighbors = [];
//   if (row > 0 && col > 0) {
//     neighbors.push(matrix[row - 1][col - 1]);
//   }
//   if (row > 0) {
//     neighbors.push(matrix[row - 1][col]);
//   }
//   if (row > 0 && col < matrix[0].length - 1) {
//     neighbors.push(matrix[row - 1][col + 1]);
//   }
//   if (col > 0) {
//     neighbors.push(matrix[row][col - 1]);
//   }
//   if (col < matrix[0].length - 1) {
//     neighbors.push(matrix[row][col + 1]);
//   }
//   if (row < matrix.length - 1 && col > 0) {
//     neighbors.push(matrix[row + 1][col - 1]);
//     if (row < matrix.length - 1) {
//       neighbors.push(board[row + 1][col]);
//     }
//     if (row < matrix.length - 1 && col < matrix[0].length - 1) {
//       neighbors.push(matrix[row + 1][col + 1]);
//     }
//   }

//   neighbors.forEach(function (neighbor) {
//     if (cell.indexOf(neighbor).classList.contains("empty")) {
//       clickedCell.indexOf(neighbor).classList.remove("overlay");
//       clickedCell.indexOf(neighbor).classList.add("open");
//     }
//   });
// }

// ФУНКЦИИ ТАЙМЕРА И ЕГО ОСТАНОВКИ

let timerId;

function timer() {
  let seconds = 0;
  timerId = setInterval(() => {
    seconds++;
    document.querySelector(".timer").textContent = seconds;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
}

// ФУНКЦИЯ ОТКРЫТИЯ МИН ПРИ КЛИКЕ НА ЛЮБУЮ ИЗ НИХ

// function openMines() {
//   const cellconts = document.querySelectorAll(".overlay");
//   cellconts.forEach((cellcont) => {
//     cellcont.addEventListener("click", (event) => {
//       const clickedCell = event.target.closest(".overlay");
//       const cellIndex = Array.from(
//         document.querySelectorAll(".overlay")
//       ).indexOf(clickedCell);
//       const cell = document.querySelectorAll(".cell")[cellIndex];

//       // cell.classList.remove("cell");
//       // cell.classList.add("newcell");
//       // clickedCell.classList.remove("overlay");
//       // clickedCell.classList.add("open");
//     });
//   });
// }
