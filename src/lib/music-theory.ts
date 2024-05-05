import { select, clone, sortBy } from "underscore";

export class Note {
    name: string;
    semitone: number; // offset from C ∈ [0,11]
    degreeOffset: number; // degree ∈ [0,6]
    canBeRootNote: boolean;
    octave: number;

    constructor(name: string, semitone: number, degreeOffset: number, canBeRootNote: boolean) {
        console.assert(semitone >= 0);
        this.name = name;
        this.semitone = semitone % 12;
        this.canBeRootNote = canBeRootNote;
        this.degreeOffset = degreeOffset - 1;
        this.octave = 2;
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

export enum ChordFamily {
    Triad,
    Tetrad,
}

export class ChordType {
    name: string;
    degrees: Interval[];
    family: ChordFamily;
    inversionCount: number;

    constructor(name: string, degrees: Interval[], family: ChordFamily) {
        this.name = name;
        this.degrees = degrees;
        this.family = family;
        this.inversionCount = degrees.length == 2 ? 3 : 4;
    }

    public isDropCompatible(dropIndex: number): boolean {
        if (this.family == ChordFamily.Triad && this.inversionCount == 3) {
            return dropIndex == 2;
        }

        if (this.family == ChordFamily.Tetrad) {
            return dropIndex >= 1 && dropIndex <= 4;
        }

        return false;
    }
}

export const notes: Note[] = [
    new Note('Cbb', 10, 1, false),
    new Note('Cb', 11, 1, false),
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
    new ChordType('Maj', [new Interval(4, 3), new Interval(7, 5)], ChordFamily.Triad),
    new ChordType('min', [new Interval(3, 3), new Interval(7, 5)], ChordFamily.Triad),
    new ChordType('dim', [new Interval(3, 3), new Interval(6, 5)], ChordFamily.Triad),
    new ChordType('Aug', [new Interval(4, 3), new Interval(8, 5)], ChordFamily.Triad),
    new ChordType('sus2', [new Interval(2, 2), new Interval(7, 5)], ChordFamily.Triad),
    new ChordType('sus4', [new Interval(5, 4), new Interval(7, 5)], ChordFamily.Triad),
    new ChordType('add2', [new Interval(2, 2), new Interval(4, 3), new Interval(7, 5)], ChordFamily.Triad),
    new ChordType('madd2', [new Interval(2, 2), new Interval(3, 3), new Interval(7, 5)], ChordFamily.Triad),
    new ChordType('add4', [new Interval(4, 3), new Interval(5, 4), new Interval(7, 5)], ChordFamily.Triad),
    new ChordType('madd4', [new Interval(3, 3), new Interval(5, 4), new Interval(7, 5)], ChordFamily.Triad),
    new ChordType('Maj7', [new Interval(4, 3), new Interval(7, 5), new Interval(11, 7)], ChordFamily.Tetrad),
    new ChordType('min7', [new Interval(3, 3), new Interval(7, 5), new Interval(10, 7)], ChordFamily.Tetrad),
    new ChordType('min7b5', [new Interval(3, 3), new Interval(6, 5), new Interval(10, 7)], ChordFamily.Tetrad),
    new ChordType('7', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7)], ChordFamily.Tetrad),
    new ChordType('dim7', [new Interval(3, 3), new Interval(6, 5), new Interval(9, 7)], ChordFamily.Tetrad),
    new ChordType('min(Maj7)', [new Interval(3, 3), new Interval(7, 5), new Interval(11, 7)], ChordFamily.Tetrad),
    new ChordType('Maj7#5', [new Interval(4, 3), new Interval(8, 5), new Interval(11, 7)], ChordFamily.Tetrad),
    new ChordType('Maj7b5', [new Interval(4, 3), new Interval(6, 5), new Interval(11, 7)], ChordFamily.Tetrad),
    new ChordType('7#5', [new Interval(4, 3), new Interval(8, 5), new Interval(10, 7)], ChordFamily.Tetrad),
    new ChordType('7b5', [new Interval(4, 3), new Interval(6, 5), new Interval(10, 7)], ChordFamily.Tetrad),
    new ChordType('Maj6', [new Interval(4, 3), new Interval(7, 5), new Interval(9, 6)], ChordFamily.Tetrad),
    new ChordType('min6', [new Interval(3, 3), new Interval(7, 5), new Interval(9, 6)], ChordFamily.Tetrad),
    new ChordType('Maj7(sus4)', [new Interval(5, 4), new Interval(7, 5), new Interval(11, 7)], ChordFamily.Tetrad),
    new ChordType('7(sus4)', [new Interval(5, 4), new Interval(7, 5), new Interval(10, 7)], ChordFamily.Tetrad),
    new ChordType('Maj7(sus2)', [new Interval(2, 2), new Interval(7, 5), new Interval(11, 7)], ChordFamily.Tetrad),
    new ChordType('7(sus2)', [new Interval(2, 2), new Interval(7, 5), new Interval(10, 7)], ChordFamily.Tetrad),
    new ChordType('Maj7(9)', [new Interval(4, 3), new Interval(7, 5), new Interval(11, 7), new Interval(14, 2)], ChordFamily.Tetrad),
    new ChordType('Maj7(9sus4)', [new Interval(5, 4), new Interval(7, 5), new Interval(11, 7), new Interval(14, 2)], ChordFamily.Tetrad),
    new ChordType('min7(9)', [new Interval(3, 3), new Interval(7, 5), new Interval(10, 7), new Interval(14, 2)], ChordFamily.Tetrad),
    new ChordType('7(9)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(14, 2)], ChordFamily.Tetrad),
    new ChordType('7(9sus4)', [new Interval(5, 4), new Interval(7, 5), new Interval(10, 7), new Interval(14, 2)], ChordFamily.Tetrad),
    new ChordType('7(b9sus4)', [new Interval(5, 4), new Interval(7, 5), new Interval(10, 7), new Interval(13, 2)], ChordFamily.Tetrad),
    new ChordType('min7b5(9)', [new Interval(3, 3), new Interval(6, 5), new Interval(10, 7), new Interval(14, 2)], ChordFamily.Tetrad),
    new ChordType('7(b9)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(13, 2)], ChordFamily.Tetrad),
    new ChordType('7(#9)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(15, 2)], ChordFamily.Tetrad),
    new ChordType('Maj7(#11)', [new Interval(4, 3), new Interval(7, 5), new Interval(11, 7), new Interval(18, 4)], ChordFamily.Tetrad),
    new ChordType('min7(11)', [new Interval(3, 3), new Interval(7, 5), new Interval(10, 7), new Interval(17, 4)], ChordFamily.Tetrad),
    new ChordType('min7b5(11)', [new Interval(3, 3), new Interval(6, 5), new Interval(10, 7), new Interval(17, 4)], ChordFamily.Tetrad),
    new ChordType('7(#11)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(18, 4)], ChordFamily.Tetrad),
    new ChordType('Maj7(13)', [new Interval(4, 3), new Interval(7, 5), new Interval(11, 7), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('min7(13)', [new Interval(3, 3), new Interval(7, 5), new Interval(10, 7), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('7(13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('Maj7(b13)', [new Interval(4, 3), new Interval(7, 5), new Interval(11, 7), new Interval(20, 6)], ChordFamily.Tetrad),
    new ChordType('7(b13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(20, 6)], ChordFamily.Tetrad),
    new ChordType('Maj7(9,#11)', [new Interval(4, 3), new Interval(7, 5), new Interval(11, 7), new Interval(14, 2), new Interval(18, 4)], ChordFamily.Tetrad),
    new ChordType('7(9,#11)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(14, 2), new Interval(18, 4)], ChordFamily.Tetrad),
    new ChordType('7(b9,#11)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(13, 2), new Interval(18, 4)], ChordFamily.Tetrad),
    new ChordType('7(#9,#11)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(15, 2), new Interval(18, 4)], ChordFamily.Tetrad),
    new ChordType('min7(9,11)', [new Interval(3, 3), new Interval(7, 5), new Interval(10, 7), new Interval(14, 2),  new Interval(17, 4)], ChordFamily.Tetrad),
    new ChordType('min7b5(9,11)', [new Interval(3, 3), new Interval(6, 5), new Interval(10, 7), new Interval(14, 2), new Interval(17, 4)], ChordFamily.Tetrad),
    new ChordType('Maj7(9,13)', [new Interval(4, 3), new Interval(7, 5), new Interval(11, 7), new Interval(14, 2), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('7(9,13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(14, 2), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('7(b9,13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(13, 2), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('7(#9,13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(15, 2), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('7(9,b13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(14, 2), new Interval(20, 6)], ChordFamily.Tetrad),
    new ChordType('7(b9,b13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(13, 2), new Interval(20, 6)], ChordFamily.Tetrad),
    new ChordType('7(#9,b13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(15, 2), new Interval(20, 6)], ChordFamily.Tetrad),
    new ChordType('min7(9,13)', [new Interval(3, 3), new Interval(7, 5), new Interval(10, 7), new Interval(14, 2),  new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('min7b5(9,13)', [new Interval(3, 3), new Interval(6, 5), new Interval(10, 7), new Interval(14, 2), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('Maj7(9,#11,13)', [new Interval(4, 3), new Interval(7, 5), new Interval(11, 7), new Interval(14, 2), new Interval(18, 4), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('7(9,#11,13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(14, 2), new Interval(18, 4), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('7(b9,#11,13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(13, 2), new Interval(18, 4), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('7(#9,#11,13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(15, 2), new Interval(18, 4), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('7(9,#11,b13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(14, 2), new Interval(18, 4), new Interval(20, 6)], ChordFamily.Tetrad),
    new ChordType('7(b9,#11,b13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(13, 2), new Interval(18, 4), new Interval(20, 6)], ChordFamily.Tetrad),
    new ChordType('7(#9,#11,b13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(15, 2), new Interval(18, 4), new Interval(20, 6)], ChordFamily.Tetrad),
    new ChordType('min7(9,11,13)', [new Interval(3, 3), new Interval(7, 5), new Interval(10, 7), new Interval(14, 2), new Interval(17, 4),  new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('min7b5(9,11,13)', [new Interval(3, 3), new Interval(6, 5), new Interval(10, 7), new Interval(14, 2), new Interval(17, 4), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('7(b9,#9,#11,b13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(13, 2), new Interval(15, 2), new Interval(18, 4), new Interval(20, 6)], ChordFamily.Tetrad),
    new ChordType('7(b9,#9,#11,13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(13, 2), new Interval(15, 2), new Interval(18, 4), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('7(b9,#9,13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(13, 2), new Interval(15, 2), new Interval(21, 6)], ChordFamily.Tetrad),
    new ChordType('7(b9,#9,b13)', [new Interval(4, 3), new Interval(7, 5), new Interval(10, 7), new Interval(13, 2), new Interval(15, 2), new Interval(20, 6)], ChordFamily.Tetrad),
    new ChordType('7b5(b9,#9,b13)', [new Interval(4, 3), new Interval(6, 5), new Interval(10, 7), new Interval(13, 2), new Interval(15, 2), new Interval(20, 6)], ChordFamily.Tetrad),
];

export class Chord {
    name: string;
    rootNote: Note;
    type: ChordType;
    notes: Note[];

    constructor(rootNote: Note, type: ChordType, inversion: number, drop: number[]) {
        this.name = `${rootNote.name}${type.name}`;
        this.rootNote = clone(rootNote);
        this.type = type;

        // Check that drops are authorized.
        for (let i = drop.length - 1; i >= 0; i--) {
            if (!type.isDropCompatible(drop[i])) {
                console.error(`Drop ${drop[i]} is not compatible with chord type ${type.name}`);
                drop.splice(i, 1); // Remove drop that are not compatible.
            }
        }
        
        // Fill chord with the chord notes.
        this.notes = [ this.rootNote ];
        for (let i = 0; i < type.degrees.length; ++i) {
            let semitone = (this.rootNote.semitone + type.degrees[i].semitone) % 12;
            let degree = (this.rootNote.degreeOffset + type.degrees[i].degree) % 7;
            
            let note = clone(notes.find(note => note.semitone == semitone && note.degreeOffset == degree));
            if (note === undefined)
            {
                console.error(`Can't find note (st: ${semitone} deg: ${degree}). rootnote: (st: ${this.rootNote.semitone} deg: ${this.rootNote.degreeOffset}) interval: (st: ${type.degrees[i].semitone} deg: ${type.degrees[i].degree})`);
                continue;
            }

            note.octave += Math.floor((this.rootNote.semitone + type.degrees[i].semitone) / 12);

            this.notes.push(note)
        }

        // Compute the chord inversion to be the requested one even after a potential drop.
        var tempInversion = inversion;
        var dropName = "";
        
        if (drop.length > 0) {
            dropName += ` drop `;
            var lastDrop = drop[drop.length - 1];
            tempInversion = (inversion + lastDrop) % type.inversionCount;
        }

        // Apply inversion.
        for (let i = 0; i < tempInversion; ++i) {
            this.notes[i].octave++;
        }

        this.notes = sortBy(this.notes, note => note.octave * 12 + note.semitone);

        // Apply drop.
        for (var d = 0; d < drop.length; d++) {
            dropName += d > 0 ? `,${drop[d]}` : drop[d];
            this.notes[type.inversionCount - drop[d]].octave--;
        }

        this.notes = sortBy(this.notes, note => note.octave * 12 + note.semitone);

        if (this.notes[0].name != this.rootNote.name) {
            this.name += `/${this.notes[0].name}`
        }

        this.name += dropName;
    }

    public static FromName(rootNoteName: string, chordTypeName: string, inversion: number, drop: number[]): Chord | undefined {
        var rootNote = rootNotes.find(note => note.name === rootNoteName);
        var chordType = chordTypes.find(chord => chord.name === chordTypeName);

        if (rootNote !== undefined && chordType !== undefined)
        {
            return new Chord(rootNote, chordType, inversion, drop);
        }

        return undefined;
    }
}
