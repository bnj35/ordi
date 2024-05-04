var row = document.querySelectorAll('row');
// var image = document.querySelectorAll('img');
// let x = 0;
// let y = 0;
// // let isInside = false;

// document.addEventListener('mousemove', function() {
//     x = window.event.clientX;
//     y = window.event.clientY;

//         image[0].style.top =  y +'px';
//         image[0].style.left = x + 'px';
// });

// for (var i =0 ; i<row.length;i++){
//     if (row[i].contains(image)){
//         isInside = true ; 
//         console.log('inside');;
//     }
//     else {
//         isInside = false;
//         console.log('outside');
//     }
// }


    var divName =  document.querySelectorAll('img'); // div that is to follow the mouse (must be position:absolute)
    var offX = 15;          // X offset from mouse position
    var offY = -80;          // Y offset from mouse position
    
    function mouseX(evt) {if (!evt) evt = window.event; if (evt.pageX) return evt.pageX; else if (evt.clientX)return evt.clientX + (document.documentElement.scrollLeft ?  document.documentElement.scrollLeft : document.body.scrollLeft); else return 0;}
    function mouseY(evt) {if (!evt) evt = window.event; if (evt.pageY) return evt.pageY; else if (evt.clientY)return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop); else return 0;}
    
    // function follow(evt) {
    //     var obj = document.images.style;
    //     obj.left = (parseInt(mouseX(evt))+offX) + 'px';
    //     obj.top = (parseInt(mouseY(evt))+offY) + 'px'; 
    //     }

    function follow(evt) {
        for (var i = 0; i < document.images.length; i++) {
            var obj = document.images[i].style;
            obj.left = (parseInt(mouseX(evt))+offX) + 'px';
            obj.top = (parseInt(mouseY(evt))+offY) + 'px'; 
        }
    }

    document.onmousemove = follow;

    function showDiv() {
        document.divName.style.display = "block";
    }

    function hideDiv() {
        document.divName.style.display = "none";
    }

    for (var i = 0; i < row.length; i++) {
        row[i].addEventListener('mouseover', function() {
            showDiv();
        });
        row[i].addEventListener('mouseout', function() {
            hideDiv();
        });
    }

// id='onme' onMouseover='document.getElementById(divName).style.display="block"' onMouseout='document.getElementById(divName).style.display="none"'