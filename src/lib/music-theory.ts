import { select } from "underscore";

export class Note {
    name: string;
    semitone: number; // offset from C ∈ [0,11]
    degreeOffset: number; // degree ∈ [0,6]
    canBeRootNote: boolean;

    constructor(name: string, semitone: number, degreeOffset: number, canBeRootNote: boolean) {
        this.name = name;
        this.semitone = semitone % 12;
        this.canBeRootNote = canBeRootNote;
        this.degreeOffset = degreeOffset - 1;
    }
}

class Interval {
    semitone: number; // in semitone ∈ [0,∞[
    degree: number; // degree ∈ [0,∞[

    constructor(semitone: number, degree: number) {
        this.semitone = semitone;
        this.degree = degree - 1;
    }
}

export class ChordType {
    name: string;
    degrees: Interval[];

    constructor(name: string, degrees: Interval[]) {
        this.name = name;
        this.degrees = degrees;
    }
}

export const notes: Note[] = [
    new Note('Cbb', -2, 1, false),
    new Note('Cb', -1, 1, false),
    new Note('C', 0, 1, true),
    new Note('C#', 1, 1, true),
    new Note('Cx', 2, 1, false),
    new Note('Dbb', 0, 2, false),
    new Note('Db', 1, 2, true),
    new Note('D', 2, 2, true),
    new Note('D#', 3, 2, true),
    new Note('Dx', 4, 2, false),
    new Note('Ebb', 2, 3, false),
    new Note('Eb', 3, 3, true),
    new Note('E', 4, 3, true),
    new Note('E#', 5, 3, false),
    new Note('Ex', 6, 3, false),
    new Note('Fb', 4, 4, false),
    new Note('F', 5, 4, true),
    new Note('F#', 6, 4, true),
    new Note('Fx', 7, 4, false),
    new Note('Gbb', 5, 5, false),
    new Note('Gb', 6, 5, true),
    new Note('G', 7, 5, true),
    new Note('G#', 8, 5, true),
    new Note('Gx', 9, 5, false),
    new Note('Abb', 7, 6, false),
    new Note('Ab', 8, 6, true),
    new Note('A', 9, 6, true),
    new Note('A#', 10, 6, true),
    new Note('Ax', 11, 6, false),
    new Note('Bbb', 9, 7, false),
    new Note('Bb', 10, 7, true),
    new Note('B', 11, 7, true),
    new Note('B#', 12, 7, false),
];

export const rootNotes: Note[] = select(notes, note => note.canBeRootNote);

export const chordTypes: ChordType[] = [
    new ChordType('Maj', [new Interval(4, 3), new Interval(7, 5)]),
    new ChordType('Min', [new Interval(3, 3), new Interval(7, 5)]),
    new ChordType('Dim', [new Interval(3, 3), new Interval(6, 5)]),
    new ChordType('Aug', [new Interval(4, 3), new Interval(8, 5)]),
    new ChordType('Maj7', [new Interval(4, 3), new Interval(7, 5), new Interval(11, 7)]),
    new ChordType('Min7', [new Interval(3, 3), new Interval(7, 5), new Interval(10, 7)]),
    new ChordType('-7b5', [new Interval(3, 3), new Interval(6, 5), new Interval(10, 7)]),
    new ChordType('7', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7)]),
    new ChordType('Min(Maj7)', [new Interval(3, 3), new Interval(7, 5), new Interval(11, 7)]),
    new ChordType('Maj7#5', [new Interval(4, 3), new Interval(8, 5), new Interval(11, 7)]),
    new ChordType('Maj7b5', [new Interval(4, 3), new Interval(6, 5), new Interval(11, 7)]),
    new ChordType('7#5', [new Interval(4, 3), new Interval(8, 5), new Interval(10, 7)]),
    new ChordType('7b5', [new Interval(4, 3), new Interval(6, 5), new Interval(10, 7)]),
];

export class Chord {
    name: string;
    rootNote: Note;
    type: ChordType;
    notes: Note[];

    constructor(rootNote: Note, type: ChordType) {
        this.name = `${rootNote.name}${type.name}`;
        this.rootNote = rootNote;
        this.type = type;

        this.notes = [ rootNote ];
        for (let i = 0; i < type.degrees.length; ++i) {
            let semitone = (rootNote.semitone + type.degrees[i].semitone) % 12;
            let degree = (rootNote.degreeOffset + type.degrees[i].degree) % 7;

            let note = notes.find(note => note.semitone == semitone && note.degreeOffset == degree);
            if (note === undefined)
            {
                console.error(`Can't find note (st: ${semitone} deg: ${degree}). rootnote: (st: ${rootNote.semitone} deg: ${rootNote.degreeOffset}) interval: (st: ${type.degrees[i].semitone} deg: ${type.degrees[i].degree})`);
                continue;
            }

            this.notes.push(note)
        }
    }
}
