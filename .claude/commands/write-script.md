# /write-script

Generates a structured pre-production script for a LayerProof composition before any code is written.

## Usage
```
/write-script [composition-id] [prompt]
```

## Examples
```
/write-script layerproof-problem "Show the pain of managing content across 5 disconnected tools"
```
```
/write-script layerproof-solution "Introduce LayerProof as the tool that writes for every platform from one prompt"
```

## What this command does
1. Delegates to the `script-writer` agent with the composition ID and prompt
2. Agent writes the full structured script with all scene sections populated
3. Saves output to `scripts/[composition-id].md` with `status: draft`
4. Reports back with the script file path and next steps

## After running
Review `scripts/[composition-id].md`. Edit copy, motion intent, and audio notes to match your vision. When satisfied, change `status` from `draft` to `approved` in the frontmatter, then build scenes one at a time:

```
/new-scene [SceneName] [teaser-number] [duration-in-seconds] [description]
```

## Agent Instructions
When executing this command:
1. Parse the composition ID and prompt from the arguments
2. Delegate to the `script-writer` agent
3. Agent writes `scripts/[composition-id].md` with `status: draft`
4. Confirm the file was saved and show the user the path
5. Tell the user: "Review `scripts/[composition-id].md`. When satisfied, change `status` from `draft` to `approved`, then run `/new-scene` to start building."
