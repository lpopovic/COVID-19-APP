class Location {
    constructor(object) {
        this.longitude = Number(object.longitude) || 0;
        this.latitude = Number(object.latitude) || 0;
        this.weight = Number(object.weight) || 1;
    }


    static createArrayObjects(objectArray) {

        const arrayTemplate = objectArray.map(item => {

            return new Location(item);

        })
        return arrayTemplate;

    }
}

export { Location };