const photoFile = document.getElementById('photo-file');
let photoPreview = document.getElementById('photo-preview');
let image;
let photoName;
//Selecao e visualização da imagem

document.getElementById('select-image')
.onclick = () =>{
    photoFile.click()
}

window.addEventListener('DOMContentLoaded', () =>{
    photoFile.addEventListener('change', () =>{
        let file = photoFile.files.item(0);
        photoName = file.name;
        

        //ler um arquivo
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event){
            image = new Image();
            image.src = event.target.result;
            image.onload = onLoadImage;
        }
    })
})

//Ferramentas de selecao

const selection = document.getElementById('selection-tool');

let startX, startY, startRelativeX, startRelativeY,
endX, endY, endRelativeX, endRelativeY;

let startSelection = false;

const events = {
    mouseover(){
        this.style.cursor = 'crosshair'
        //console.log('mouseover');
    },
    mousedown(){
        const {clientX, clientY, offsetX, offsetY} = event;
        console.table({
            'client': [clientX, clientY],
            'offset': [offsetX, offsetY]
        })

        startX = clientX;
        startY = clientY;
        startRelativeX = offsetX;
        startRelativeY = offsetY;

        startSelection = true;
    },
    mousemove(){
        endX = event.clientX;
        endY = event.clientY;

        if(startSelection){
        selection.style.display = 'initial';
        selection.style.top = startY + 'px';
        selection.style.left = startX + 'px';

        selection.style.width = (endX - startX) + 'px';
        selection.style.height = (endY - startY) + 'px';
    }
    },
    mouseup(){
        startSelection = false;
        endRelativeX = event.layerX;
        endRelativeY = event.layerY;

        cropButton.style.display = 'initial';
    }
}

Object.keys(events).forEach(eventName =>{
    // addEventListener('mouseover', events.mouserover)
    photoPreview.addEventListener(eventName, events[eventName]);
})

//CANVAS

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

function onLoadImage(){
    const { width, height} = image;
    canvas.width = width;
    canvas.height = height;

    //Limpando o contexto para previnir
    ctx.clearRect(0, 0, width, height)

    //Desenha a imagem no contexto
    ctx.drawImage(image, 0, 0);

    photoPreview.src = canvas.toDataURL();
}

//Cortar imagem

const cropButton = document.getElementById('crop-image');

cropButton.onclick = () =>{
    const {width: imagew, height: imageh} = image;
    const {width: previeww, height: previewh} = photoPreview;

    /*
    const widthFactor = Imagew/ pewvieww;
    const heightFactor = imageh / previewh;
    Isso é a mesma coisa que isso 
    O "+" é para garantir que o resultado seja numeros
    */

    const [widthFactor, heightFactor] = 
    [+(imagew / previeww), +(imageh/previewh)];

    const [widthSelection, heightSelection] = [
        +selection.style.width.replace('px', ''),
        +selection.style.height.replace('px', '')    
    ];

    const [widthCropped, heightCropped] = 
    [
        +(widthSelection * widthFactor),
        +(heightSelection * heightFactor)
    ];

    const [actualX, actualY] = [
        +(startRelativeX  * widthFactor),
        +(startRelativeY * heightFactor)
    ];

    // pegando do contexto a imagem ja cortada
    const croppedImage = ctx.getImageData(actualX, actualY,
        widthCropped, heightCropped);

    ctx.clearRect(0, 0, ctx.width, ctx.height);

    image.width = canvas.width = widthCropped;
    image.height = canvas.height = heightCropped;

    ctx.putImageData(croppedImage, 0, 0);

    selection.style.display = 'none';

    photoPreview.src = canvas.toDataURL();
    downloadImage.style.display = 'initial';
    }

    //Exportar imagem
    const downloadImage = document.getElementById('download-image')
    downloadImage.onclick = () =>{
            const a = document.createElement('a');
            a.download = photoName + '-cropped.png';
            a.href = canvas.toDataURL();
            a.click();
        }
    
