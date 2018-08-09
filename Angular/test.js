const arr = [12,3,45,6,7,8,9,1];

for (var i = 0; i<arr.length; i++){
    setTimeout(function(){
        console.log('i is ' + i + ' element '+ arr[i]);
    }, 3000)
}