#!/usr/bin/env python3
"""
Script to fix MCInterface.vue to work with backend schema
Adds watcher to adapt backend schema to frontend expectations
"""

file_path = "client/src/components/MCInterface.vue"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the watch section or add one after computed
# Look for the mounted section to insert before it
search_text = """  },
  async mounted() {"""

replace_text = """  },
  watch: {
    // Adapt backend schema to frontend expectations
    currentMatch: {
      handler(newMatch) {
        if (!newMatch) return;

        // Add compatibility fields if using new backend schema
        if (newMatch.lines && !newMatch.improvs) {
          newMatch.improvs = newMatch.lines.map(line => ({
            id: line.line_id,
            title: line.title,
            duration: line.duration_planned,
            theme: line.theme,
            status: line.status,
            music: line.music,
            type: line.category
          }));
        }

        if (newMatch.teams && !newMatch.teamA) {
          newMatch.teamA = newMatch.teams.home || { name: 'Équipe A', score: 0 };
          newMatch.teamB = newMatch.teams.away || { name: 'Équipe B', score: 0 };
        }

        if (newMatch.match_id && !newMatch.id) {
          newMatch.id = newMatch.match_id;
        }
      },
      immediate: true,
      deep: false
    }
  },
  async mounted() {"""

if search_text in content:
    content = content.replace(search_text, replace_text)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("✅ MCInterface.vue fixed successfully!")
else:
    print("❌ Could not find the target section in MCInterface.vue")
    print("Looking for alternative insertion point...")

    # Try alternate location
    alt_search = """  async mounted() {"""
    if alt_search in content:
        alt_replace = """  watch: {
    currentMatch: {
      handler(newMatch) {
        if (!newMatch) return;
        if (newMatch.lines && !newMatch.improvs) {
          newMatch.improvs = newMatch.lines.map(line => ({
            id: line.line_id,
            title: line.title,
            duration: line.duration_planned,
            theme: line.theme,
            status: line.status,
            music: line.music,
            type: line.category
          }));
        }
        if (newMatch.teams && !newMatch.teamA) {
          newMatch.teamA = newMatch.teams.home || { name: 'Équipe A', score: 0 };
          newMatch.teamB = newMatch.teams.away || { name: 'Équipe B', score: 0 };
        }
        if (newMatch.match_id && !newMatch.id) {
          newMatch.id = newMatch.match_id;
        }
      },
      immediate: true,
      deep: false
    }
  },
  async mounted() {"""
        content = content.replace(alt_search, alt_replace, 1)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("✅ MCInterface.vue fixed with alternate method!")
