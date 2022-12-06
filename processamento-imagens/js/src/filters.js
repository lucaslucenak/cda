const HALF = 1.0 / 2.0;
const FOURTH = 1.0 / 4.0;
const EIGHTH = 1.0 / 8.0;
const NINTH = 1.0 / 9.0;
const SIXTEENTH = 1.0 / 16.0;

const edgeDetection = [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]];
const edgeDetection2 = [[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]];
const laplace = [[0, -1, 0], [-1, 4, -1], [0, -1, 0]];
const sharpen = [[0, -0.2, 0], [-0.2, 1.8, -0.2], [0, -0.2, 0]];
const sharpen2 = [[0, -1, 0], [-1, 5, -1], [0, -1, 0]];
const sharpen3 = [[1, -2, 1], [-2, 5, -2], [1, -2, 1]];

const sobelX = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
const sobelY = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
const sobelXY = (img) => magnitude(convolution(img, sobelX, doNormalize), convolution(img, sobelY, doNormalize), img.w, img.h, doNormalize);

const prewittX = [[-1, -1, -1], [0, 0, 0], [1, 1, 1]];
const prewittY = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]];
const prewittXY = (img) => magnitude(convolution(img, prewittX, doNormalize), convolution(img, prewittY, doNormalize), img.w, img.h, doNormalize);

const average = [[NINTH, NINTH, NINTH], [NINTH, NINTH, NINTH], [NINTH, NINTH, NINTH]];

const gaussianBlur = [
    [SIXTEENTH, EIGHTH, SIXTEENTH],
    [EIGHTH, FOURTH, EIGHTH],
    [SIXTEENTH, EIGHTH, SIXTEENTH]
];

const gradientX = [[0, 0, 0], [0, 1, 0], [0, -1, 0]];
const gradientY = [[0, 0, 0], [0, 1, -1], [0, 0, 0]];
const gradientXY = (img) => magnitude(convolution(img, gradientX, doNormalize), convolution(img, gradientY, doNormalize), img.w, img.h, doNormalize);


const robertsX = [[0, 0, 0], [0, 1, 0], [0, 0, -1]];
const robertsY = [[0, 0, 0], [0, 0, 1], [0, -1, 0]];
const robertsXY = (img) => magnitude(convolution(img, robertsX, doNormalize), convolution(img, robertsY, doNormalize), img.w, img.h, doNormalize);

const none = [[0, 0, 0], [0, 1, 0], [0, 0, 0]];

const custom = [[0, 0, 0], [0, 1, 0], [0, 0, 0]];

let activeKernel = none;

const kernel = {
    0: none,
    1: custom,
    2: edgeDetection,
    3: edgeDetection2,
    4: sharpen,
    5: sobelX,
    6: sobelY,
    7: prewittX,
    8: prewittY,
    9: average,
    10: gaussianBlur,
    11: gradientX,
    12: gradientY,
    13: robertsX,
    14: robertsY,
    17: laplace,
    18: sharpen2,
    15: sharpen3,
};

const operators = {
    19: robertsXY,
    20: gradientXY,
    21: sobelXY,
    22: prewittXY,
    23: medianFilter,
}

const imagesPath = {
    0: '../assets/lena.pgm',
    1: '../assets/lenasalp.pgm',
    2: '../assets/lenag.pgm',
    3: '../assets/airplane.pgm',
    4: '../assets/pepper.pgm',
    5: '../assets/brain.pgm',
    6: '../assets/barbara.pgm',
    7: '../assets/einstein.pgm',
    8: '../assets/sea.pgm',
};

const applyFilterBtn = document.getElementById('apply-filter-btn');
const applyAgainBtn = document.getElementById('apply-again-btn');
const downloadBtn = document.getElementById('download-btn');

const filterSelector = document.getElementById('input-filter');
const inputMatrix = document.getElementById('input-matrix');
const inputMatrixValues = document.getElementsByName('array[]');
const imgSelector = document.getElementById('img-selector');
const scalar = document.getElementById('scalar');

const normalizeSwitch = document.getElementById('normalizeSwitch');

let doNormalize = false;

let img = new Image();
let processedImg = new Image();

const mainCanvas = function (sketch) {
    sketch.setup = function () {
        sketch.createCanvas(256, 256).parent("original-img");
        readImage('../assets/lena.pgm', sketch, img);
    }

    imgSelector.onchange = _ => readImage(imagesPath[imgSelector.value], sketch, img);

    applyAgainBtn.onclick = function () {
        if (processedImg.w !== 0) {
            img.data = processedImg.data;
            paintImage(sketch, img);
        }
    }

    inputMatrix.onchange = function () {
        if (filterSelector.value !== 1) filterSelector.value = 1;

        let k = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                custom[i][j] = parseFloat(scalar.value) * parseFloat(inputMatrixValues[k++].value);
            }
        }
        activeKernel = custom;
    }
}


const processedCanvas = function (sketch) {
    sketch.setup = function () {
        sketch.createCanvas(256, 256).parent("processed-img");
    };

    filterSelector.onchange = function () {
        let value = filterSelector.value;
        processedImg.type = img.type;
        processedImg.w = img.w;
        processedImg.h = img.h;


        if (value >= 19) {// filtros de magnitude > 18
            processedImg.data = operators[value](img);
        } else {
            activeKernel = kernel[value];
            let k = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    inputMatrixValues[k++].value = `${activeKernel[i][j]}`;
                }
            }
            processedImg.data = convolution(img, activeKernel, doNormalize)
        }
        paintImage(sketch, processedImg);
    }

    normalizeSwitch.onchange = function () {
        doNormalize = !doNormalize;
    }

    applyFilterBtn.onclick = function () {
        if (filterSelector.value < 19) {
            processedImg.data = convolution(img, activeKernel, doNormalize);
            paintImage(sketch, processedImg);
        }
    }

    downloadBtn.onclick = function () {
        let filename = "image.pgm";
        download(filename, processedImg);
    }
};


function medianFilter(img) {
    let arr = [];
    let res = [];
    let h = img.h;
    let w = img.w;
    let data = img.data;

    for (let i = 0; i < h; i++) {
        res[i] = [];

        for (let j = 0; j < w; j++) {
            arr[0] = i === 0 || j === 0 ? 0 : data[i - 1][j - 1];
            arr[1] = i === 0 ? 0 : data[i - 1][j];
            arr[2] = i === 0 || j === w - 1 ? 0 : data[i - 1][j + 1];

            arr[3] = j === 0 ? 0 : data[i][j - 1];
            arr[4] = data[i][j];
            arr[5] = j === w - 1 ? 0 : data[i][j + 1];

            arr[6] = i === h - 1 || j === 0 ? 0 : data[i + 1][j - 1];
            arr[7] = i === h - 1 ? 0 : data[i + 1][j];
            arr[8] = i === h - 1 || j === w - 1 ? 0 : data[i + 1][j + 1];

            insertionSort(arr, 9);
            res[i][j] = arr[4]
        }
    }

    return doNormalize ? normalize(res, w, h) : res;
}


new p5(mainCanvas, 'p5sketch');
new p5(processedCanvas, 'p5sketch');
