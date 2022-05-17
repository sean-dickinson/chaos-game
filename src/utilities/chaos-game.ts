import {Point} from '@mathigon/euclid';

export function getNextPoint(start: Point, end: Point, fraction: number ):Point {
    const newX = (start.x + end.x) * fraction;
    const newY = (start.y + end.y) * fraction;
    return new Point(newX, newY);
}

export function sample<Type>(choices: Type[]): Type {
    const index = Math.floor((Math.random() * choices.length))
    return choices[index];
}

export function getInitialPoints(width: number, height: number, padding = 5): Point[]{
    const verticies: Point[] = [];
    verticies.push(new Point(width / 2, padding)); // TOP
    verticies.push(new Point(padding, height - padding)); // LEFT
    verticies.push(new Point(width - padding, height - padding)); // RIGHT
    return verticies;
}

export function chaosGame(start: Point, verticies: Point[], iterations: number, fraction: number): Point[] {
    const points = [start];

    for(let i = 0; i < iterations; i++){
        const lastPoint = points.at(-1) as Point;
        const randomVertex = sample(verticies);
        points.push(getNextPoint(lastPoint, randomVertex, fraction));
    }
    return points;
}