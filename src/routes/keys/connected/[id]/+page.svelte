<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    let sessions = [];

    // Fetch data on component mount
    onMount(() => {
        const unsubscribe = page.subscribe(async ($page) => {
            const keyId = $page.params.id; // Assuming the route is defined as [id]
            try {
                const response = await fetch(`/api/session-keys/my-session-connected-keys/${keyId}`);
                const result = await response.json();
                if (result.status === 'success') {
                    sessions = result.data;
                } else {
                    console.error('Failed to fetch sessions:', result.message);
                }
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        });

        return unsubscribe; // Return the cleanup function synchronously
    });
</script>

<div class="sessions">
    {#each sessions as session}
        <div class="session">
            <h2>Session ID: {session.id}</h2>
            <p>Description: {session.description}</p>
            <p>Intention: {session.intention}</p>
            <p>Created: {new Date(session.created).toLocaleString()}</p>

            <div class="case">
                <h3>Case Details</h3>
                <p>Name: {session.case.name}</p>
                <p>Email: {session.case.email}</p>
                <p>Color: <span style="background-color: {session.case.color};">{session.case.color}</span></p>
            </div>

            <div class="analyses">
                <h3>Analyses</h3>
                {#each session.analyses as analysis}
                    <div class="analysis">
                        <h4>Analysis ID: {analysis.id}</h4>
                        <p>Catalog: {analysis.catalog.name}</p>
                        <p>Target GV: {analysis.target_gv}</p>

                        <div class="rate-analyses">
                            <h5>Rate Analyses</h5>
                            {#each analysis.rate_analyses as rate}
                                <div class="rate">
                                    <p>Signature: {rate.signature}</p>
                                    <p>Energetic Value: {rate.energetic_value}</p>
                                    <p>GV: {rate.gv}</p>
                                    <p>Potency Type: {rate.potencyType}</p>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
    .sessions {
        padding: 1rem;
    }

    .session {
        margin-bottom: 2rem;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    .case, .analyses {
        margin-top: 1rem;
    }

    .analysis, .rate {
        margin-top: 0.5rem;
        padding: 0.5rem;
        border: 1px solid #eee;
        border-radius: 4px;
    }
</style>
