export const LOCAL_RESOURCES_URL = "//images.bobba.io/hof_furni/";

export default class FurniImager {
    ready: boolean;
    bases: any;
    offsets: any;
    furnidata: any;

    constructor() {
        this.ready = false;
        this.bases = { roomitem: {}, wallitem: {} };
        this.offsets = { roomitem: {}, wallitem: {} };
    }

    initialize(): Promise<void> {
        const p = this.loadFiles();
        return Promise.all(p).then(() => {
            this.ready = true;
        });
    }

    loadFiles(): Promise<void>[] {
        return [
            this.fetchJsonAsync(LOCAL_RESOURCES_URL + "furnidata.json")
                .then(data => {
                    this.furnidata = data;
                }),
        ];
    }

    fetchJsonAsync(URL: string): Promise<object> {
        return new Promise((resolve, reject) => {

            const options: RequestInit = {
                method: 'GET',
                mode: 'cors',
                cache: 'default',
            };

            fetch(URL, options)
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }
}