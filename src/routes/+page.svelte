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

<h1>Welcome to Ear Workout</h1>

<button on:click={getRandomChord}>Generate</button>

{#if chord !== undefined}
<p>
    Chord: {chord.name}
</p>
<p>
    Notes: 
    {#each chord.notes as note, i}
    {note.name}
    {#if i < chord.notes.length - 1}
    -&nbsp;
    {/if}
    {/each}
</p>
{/if}
