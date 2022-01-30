/**
 * returns a name converted to lower case with special characters removed
 * @param {string} name orginal name
 */
function referenceName(name) {
    const refName = name.replaceAll(/\W+/ig,"");
    return refName.toLowerCase();
}
function reciprocalDir(direction) {
    switch (direction) {
        case "north" :
            return "south";
        case "south":
            return "north";
        case "west":
            return "east";
        case "east":
            return "west";
        case "up":
            return "down";
        case "down":
            return "up";
    }
    return direction;
}


function State(currentState = true, onWord = "", offWord = "") {
    var state = currentState;
    var onTrigger;
    if (Array.isArray(onWord)) onTrigger = onWord;
    else onTrigger = [onWord];
    var offTrigger;
    if (Array.isArray(offWord)) offTrigger = offWord;
    else offTrigger = [offWord];
    this.currentState = function(newState) {
        if (newState === undefined) 
            return state;
        else if (newState === true || newState === false || newState === null)
            state = newState;
    }
    this.toggleState = function() {
        state = !state;
    }
    this.trigger = function(word) {
        if (!state && onTrigger.some((elem) => elem.toLowerCase() == word.toLowerCase()))
            this.currentState(true);
        else if (state && offTrigger.some((elem) => elem.toLowerCase() == word.toLowerCase()))
            this.currentState(false);
    };
}


function AGElem (elementType = "room")  {
    elementType = elementType.toLowerCase();
    var name ="";
    var refName = "";
    var rooms = null;
    var health = null;
    var minHealth = null;
    var maxHealth = null;
    var healthReduction = 0;
    var qty = 1;
    var connectedElements = [];
    var parentMap = null;
    var seen = false;
    /**
     * gets or sets name
     * @param {string} newName (if null/undefined returns current name)
     * @returns current name if newName is null/undefined
     */
    this.name = function(newName) {
        if (newName == null)
            return name;
        name = newName;
        refName = referenceName(newName);
    };

    this.reference = function() {
        return refName;
    }

    this.gameMap = function(newMap) {
        if (newMap === undefined) return parentMap;
        if (newMap instanceof AGMap) {
            parentMap = newMap;
            parentMap.addToMap(this);
        }
    }

    if (elementType == "room")
    {
        rooms = {north: null, south: null, west: null, east: null, up: null, down: null, teleport: null};
        /**
         * gets or sets room
         * @param {string} direction north/south/west/east/up/down -- direction room is connected in
         * @param {Room} newValue new value for the room (optional)
         * @returns {Room} current Room object, if newValue is undefiend
         */
        this.room = function(direction,newValue, reciprocal = true){
            if (direction != null && newValue === undefined) return rooms[direction];
            if (!newValue.hasOwnProperty(direction)) return null;
            if (reciprocal) newValue.room(reciprocalDir(direction),this,false);
            if (newValue === undefined)
                return rooms[direction];
            else {
                if (newValue !== null && !((newValue instanceof AGElem) && newValue.hasOwnProperty('room'))) return false;
                rooms[direction] = newValue
            }
            return true;
        }
        this.rms = rooms;
        
        this.north = function(newRoom)
        {
            return this.room("north",newRoom);
        }
        
        this.south = function(newRoom)
        {
            return this.room("south",newRoom);
        }
        
        this.west = function(newRoom)
        {
            return this.room("west",newRoom);
        }
        
        this.east = function(newRoom)
        {
            return this.room("east",newRoom);
        }
        
        this.up = function(newRoom)
        {
            return this.room("up",newRoom);
        }
        
        this.down = function(newRoom)
        {
            return this.room("down",newRoom);
        }
    } // end of room-only functions

    /**
     * add new collectable or furniture to this
     * @param {Element} newElement 
     */
    this.addElement = function(newElement) {
        if (typeof newElement != "AGElem") return;
        let duplicate = connectedElements.findIndex(elem => elem.reference() == newElement.reference());
        if (duplicate < 0) {
            // no duplucate exists, add to array
            connectedElements.push(newElement)
        }
        else {
            // a duplicate exists, add quantities and use most recent item
            newElement.addQuantity(connectedElements[duplicate].quantity());
            connectedElements[duplicate] = newElement;
        }
    }

    /**
     * remove a connected element from this room
     * @param {string} elementToRemove collectable name/refname to remove
     */
    this.removeElement = function(elementToRemove) {
        elementToRemove = referenceName(elementToRemove);
        for (let i = connectedElements.length - 1; i >=0; --i) {
            if (connectedElements[i].reference == elementToRemove.reference) {
                connectedElements[i].splice(i,1);
                break;
            }
        }
    }

    if (elementType == "collectable") {
        this.health() = function() {
            return health;
        };
        this.percentageHealth = function() {
            if (health == 0) return 0;
            if (minHealth == maxHealth) return null;
            return health / (maxHealth-minHealth);
        }
        this.setMinHealth = function(value){
            minHealth = value;
        };
        this.setMaxHealth = function(value){
            maxHealth = value;
        };
        this.setMinMaxHealth = function (min,max) {
            this.setMinHealth(min);
            this.setMaxHealth(max);
        }
        this.setHealthReduction = function (reduction) {
            healthReduction = reduction;
        }
        this.resetHealth = function() {
            health = maxHealth;
        }
        this.update = function() {
            if (this.currentState()) this.health -= healthReduction;
            if (health < minHealth) {
                this.qty -= 1;
                if (qty <= 0) {
                    this.currentState(false);
                    this.visible(false);
                }
            }
        };
    }

    if (elementType == "collectable" || elementType == "furniture") {
        this.quantity = function (newQuantity){
            if (newQuantity === undefined)
                return qty;
            else
                qty = newQuantity;
        }
        this.addQuantity = function(qtyToAdd) {
            qty += qtyToAdd;
        }
    }
}

function AGMap(){
    var gameMap=[];
    var collectables=[];
    var furniture=[];
    this.addToMap = function(element) {
        if (!(element instanceof AGElem)) {

        }
    }
}