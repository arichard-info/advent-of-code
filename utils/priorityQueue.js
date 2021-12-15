class QElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    push(element, priority) {
        const qElement = new QElement(element, priority);
        let contain = false;

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }

        if (!contain) this.items.push(qElement);
    }

    shift() {
        if (this.isEmpty()) return undefined;
        return this.items.shift();
    }

    pop() {
        if(this.isEmpty()) return undefined;
        return this.items.pop();
    }

    front() {
        if (this.isEmpty()) return undefined;
        return this.items[0];
    }

    rear() {
        if (this.isEmpty()) return undefined;
        return this.items[this.items.length - 1];
    }

    size() {
        return this.items.length
    }

    isEmpty() {
        return this.items.length == 0;
    }
}

module.exports = {
    PriorityQueue, QElement
}