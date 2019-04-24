const MAX_CONCURRENT_PROMISES = 1;

export default class PromiseQueue {
    queue: Promise<any>[];
    currentPromises: number;

    constructor() {
        this.queue = [];
        this.currentPromises = 0;
    }

    push(promise: Promise<any>, params?: any) {
        this.queue.push(promise);
        if (this.currentPromises <= MAX_CONCURRENT_PROMISES) {
            this._moveNext();
        }
    }

    _moveNext() {
        if (this.currentPromises <= MAX_CONCURRENT_PROMISES && this.queue.length > 0) {
            const currentPromise = this.queue.shift();
            if (currentPromise != null) {
                console.log("Moving next");
                currentPromise.then(() => {
                    this.currentPromises--;
                    this._moveNext();
                });
            }
            this.currentPromises++;
            
        }
    }
}
//interface PromiseContainer { promise: Promise<any>, params: any };