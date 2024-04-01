<script lang="ts">
    import { Chord, rootNotes, chordTypes } from '$lib/music-theory'
    
    let chord: Chord | undefined;
    function getRandomChord() {
        let index = Math.floor(Math.random() * rootNotes.length);
        let rootNote = rootNotes[index];

        index = Math.floor(Math.random() * chordTypes.length);
        let chordType = chordTypes[index];

        chord = new Chord(rootNote, chordType);
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
                {note.name}
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
