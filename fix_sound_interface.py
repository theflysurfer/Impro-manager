#!/usr/bin/env python3
"""
Script to fix SoundInterface.vue to work with backend schema
Adds computed property to adapt backend schema to frontend expectations
"""

file_path = "client/src/components/SoundInterface.vue"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the computed section and add adapter
search_text = """    availableMoods() {
      const moods = new Set();
      this.musicLibrary.forEach(music => {
        music.tags.mood.forEach(mood => moods.add(mood));
      });
      return Array.from(moods).sort();
    }
  },"""

replace_text = """    availableMoods() {
      const moods = new Set();
      this.musicLibrary.forEach(music => {
        music.tags.mood.forEach(mood => moods.add(mood));
      });
      return Array.from(moods).sort();
    }
  },
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
  },"""

if search_text in content:
    content = content.replace(search_text, replace_text)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("✅ SoundInterface.vue fixed successfully!")
else:
    print("❌ Could not find the target section in the file")
