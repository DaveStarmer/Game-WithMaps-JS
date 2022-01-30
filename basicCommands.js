var basic = {
    print: function(text="",newLine = true) {
        let txt = document.createTextNode(text);
        const displayArea = document.getElementById('display-area')
        displayArea.appendChild(txt);
        if (newLine)
            displayArea.appendChild(document.createElement('br'));
        displayArea.scrollTop = displayArea.scrollHeight  - displayArea.clientHeight;
    },
    cls: function() {
        document.getElementById('display-area').innerHTML="";
    },
    inputPrompt: function(text) {
        document.getElementById('input-prompt').innerHTML = text;
    },
    inputValue: function() {
        let input = document.getElementById('input-text');
        let val = input.value;
        input.value = "";
        return val;
    },
    inputFocus: function() {
        document.getElementById('input-text').focus();
    },
    rnd: function(number) {
        return Math.floor(Math.random() * (number + 1));
    }
};