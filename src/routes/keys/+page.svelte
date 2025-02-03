<script lang="ts">
    import { onMount } from 'svelte';
    import { token } from '$lib/auth';
    import { getKeys } from '$lib/auth';
    import { goto } from '$app/navigation';

    let keys: any[] = [];
    let error = '';

    onMount(async () => {
        if (!$token) {
            goto('/login');
            return;
        }

        try {
            keys = await getKeys($token);
        } catch (e) {
            error = 'Failed to load keys';
        }
    });

    function viewKeyDetails(keyId: string) {
        goto(`/keys/${keyId}`);
        //goto(`/my-session-connected-keys/{keyId}`)
    }
</script>


<div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
            <h1 class="text-3xl font-bold text-gray-900">Your Keys</h1>

            {#if error}
                <div class="mt-4 bg-red-50 p-4 rounded-md">
                    <p class="text-sm text-red-700">{error}</p>
                </div>
            {/if}

            <div class="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
                <ul class="divide-y divide-gray-200">
                    {#each keys as key}
                        <li>
                            <button
                                on:click={() => viewKeyDetails(key.id)}
                                class="w-full block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
                            >
                                <div class="px-4 py-4 sm:px-6">
                                    <div class="flex items-center justify-between">
                                        <div class="text-sm leading-5 font-medium text-blue-600 truncate">
                                            {key.key || key.id}
                                        </div>
                                        <div class="ml-2 flex-shrink-0 flex">
                                            <span class="status-badge {key.used ? 'used' : 'free'}">
                                                {key.used ? 'used' : 'free'}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="mt-2 sm:flex sm:justify-between">
                                        <div class="sm:flex">
                                            <div class="mr-6 flex items-center text-sm leading-5 text-gray-500">
                                                Created: 
                                                {new Date(key.created).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    timeZone: 'UTC'  // Since the timestamp is in UTC (+00:00)
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</div>

<style>
    .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .used {
        background-color: #dcfce7;
        color: #991b1b;;
    }

    .free {
        background-color: #fee2e2;
        color: #166534;
    }
</style>