<script lang="ts">
    import { version } from '$app/environment';
    import { Chord, rootNotes, chordTypes, ChordFamily } from '$lib/music-theory'
    
    let chord: Chord | undefined;
    function getRandomChord() {
        let index = Math.floor(Math.random() * rootNotes.length);
        let rootNote = rootNotes[index];

        index = Math.floor(Math.random() * chordTypes.length);
        let chordType = chordTypes[index];

        let inversion = Math.floor(Math.random() * chordType.inversionCount);

        let drop: number[] = [];
        if (chordType.inversionCount === 3) {
            if (Math.random() >= 0.5) {
                drop = [2];
            }
        }
        else if (chordType.family === ChordFamily.Tetrad) {
            switch (Math.floor(Math.random() * 5)) {
                case 0:
                    break;
                case 1:
                    drop = [2];
                case 2:
                    drop = [3];
                case 3:
                    drop = [1,3];
                case 4:
                    drop = [2,4];
            }
        }

        chord = new Chord(rootNote, chordType, inversion, drop);
        // chord = Chord.FromName('C', 'Maj7', 0, [1,3]);
    }

    getRandomChord();
</script>

<h1 class="title">Welcome to Ear Workout</h1>
<p class="subtitle">Will you sing all the chords?</p>

{#if chord !== undefined}

    <div class="box content">
        <h2>Chord: {chord.name}</h2>
        <p>
            Notes: 
            {#each chord.notes as note, i}
                {note.name}{note.octave}
                {#if i < chord.notes.length - 1}
                    -&nbsp;
                {/if}
            {/each}
        </p>
    </div>

{/if}

<div class="buttons has-addons is-centered">
  <button class="button is-large" on:click={getRandomChord}>Generate</button>
</div>

<div class="content has-text-centered has-text-weight-light is-size-7">
    <p>
        Ear Workout v{version}
    </p>
</div>
