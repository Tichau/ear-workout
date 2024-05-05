<script lang="ts">
    import { version } from '$app/environment';
    import { Chord, rootNotes, chordTypes, ChordFamily } from '$lib/music-theory'
    
    class Filter {
        name: string;
        active: boolean;
        chordFamily: ChordFamily;

        constructor(name: string, chordFamily: ChordFamily, active: boolean = false) {
            this.name = name;
            this.chordFamily = chordFamily;
            this.active = active;
        }
    }

    // Prepare chord type filters using the list of all chords.
    let chordTypeFilters: Filter[] = [];
    for (let i = 0; i < chordTypes.length; ++i) {
        const chordType = chordTypes[i];
        if (chordType.family === ChordFamily.Triad && chordType.degrees.length == 2) {
            chordTypeFilters.push(new Filter(chordType.name, chordType.family, chordType.name == 'Maj'));
        }
        else if (chordType.family === ChordFamily.Tetrad && chordType.degrees.length == 3) {
            chordTypeFilters.push(new Filter(chordType.name, chordType.family));
        }
    }

    let inversionFilter = [0];
    function toggleInversion(inversion: number) {
        const index = inversionFilter.indexOf(inversion);
        if (inversionFilter.indexOf(inversion) < 0) {
            inversionFilter = [...inversionFilter, inversion];
        } else {
            inversionFilter.splice(index, 1);
            inversionFilter = inversionFilter; // this is needed to tell svelte to refresh inversionFilter dependencies: https://learn.svelte.dev/tutorial/updating-arrays-and-objects
        }
    }

    let chord: Chord | undefined;
    function getRandomChord() {
        // Root note:
        let index = Math.floor(Math.random() * rootNotes.length);
        let rootNote = rootNotes[index];

        // Chord type:
        let activeChordTypeCount = 0;
        for (let i = 0; i < chordTypeFilters.length; ++i) {
            const filter = chordTypeFilters[i];
            if (filter.active) {
                activeChordTypeCount++;
            }
        }

        index = Math.floor(Math.random() * activeChordTypeCount);
        
        let chordType;
        for (let i = 0; i < chordTypeFilters.length; ++i) {
            const filter = chordTypeFilters[i];
            if (filter.active) {
                if (index === 0) {
                    chordType = chordTypes.find(chord => chord.name === filter.name);
                }
                
                index--;
            }
        }

        if (chordType === undefined) {
            console.error("Can't find any chord type with current filters.")
            return;
        }

        // Inversion:
        let inversions = [];
        for (let i = 0; i < chordType.inversionCount; i++) {
            if (inversionFilter.indexOf(i) !== -1) {
                inversions.push(i);
            }
        }

        if (inversions.length === 0) {
            console.error("No inversion available for current filters.")
            return;
        }

        index = Math.floor(Math.random() * inversions.length);
        let inversion = inversions[index];

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

<div>
    <h3 class="title is-3">Chord filters</h3>

    <div class="columns">
        <div class="column">
            <h4 class="title is-4">Triad</h4>
            <div class="grid">
                {#each chordTypeFilters as filter}
                    {#if filter.chordFamily === ChordFamily.Triad}
                        <div class="cell">
                            <button class="button is-rounded" class:is-active={filter.active} on:click={_ => filter.active = !filter.active}>
                                {filter.name}
                            </button>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
        <div class="column">
            <h4 class="title is-4">Tetrad</h4>
            <div class="grid">
                {#each chordTypeFilters as filter}
                    {#if filter.chordFamily === ChordFamily.Tetrad}
                        <div class="cell">
                            <button class="button is-rounded" class:is-active={filter.active} on:click={_ => filter.active = !filter.active}>
                                {filter.name}
                            </button>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
        <div class="column">
            <h4 class="title is-4">Inversion</h4>
            <div class="grid">
                <div class="cell">
                    <button class="button is-rounded" class:is-active={inversionFilter.indexOf(0) !== -1} on:click={_ => toggleInversion(0)}>
                        PF
                    </button>
                    <button class="button is-rounded" class:is-active={inversionFilter.indexOf(1) !== -1} on:click={_ => toggleInversion(1)}>
                        R1
                    </button>
                    <button class="button is-rounded" class:is-active={inversionFilter.indexOf(2) !== -1} on:click={_ => toggleInversion(2)}>
                        R2
                    </button>
                    <button class="button is-rounded" class:is-active={inversionFilter.indexOf(3) !== -1} on:click={_ => toggleInversion(3)}>
                        R3
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="content has-text-centered has-text-weight-light is-size-7">
    <p>
        Ear Workout v{version}
    </p>
</div>
