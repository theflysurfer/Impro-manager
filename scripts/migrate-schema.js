#!/usr/bin/env node

/**
 * Schema Migration Script
 *
 * Migrates matches.json from old schema to new schema
 *
 * OLD SCHEMA:
 * - id (string)
 * - teamA, teamB (object)
 * - improvs (array)
 * - music (string or null)
 *
 * NEW SCHEMA:
 * - match_id (string)
 * - teams.home, teams.away (object)
 * - lines (array)
 * - music.intro/outro/transition (object with settings)
 * - live_state (object)
 */

const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, '..', 'data')
const MATCHES_FILE = path.join(DATA_DIR, 'matches.json')
const BACKUP_FILE = path.join(DATA_DIR, 'matches.json.backup')

console.log('🔄 Starting schema migration...\n')

// Read old matches
let oldMatches
try {
  const rawData = fs.readFileSync(MATCHES_FILE, 'utf-8')
  oldMatches = JSON.parse(rawData)
  console.log(`✅ Read ${oldMatches.length} matches from ${MATCHES_FILE}`)
} catch (error) {
  console.error('❌ Error reading matches.json:', error.message)
  process.exit(1)
}

// Backup old file
try {
  fs.copyFileSync(MATCHES_FILE, BACKUP_FILE)
  console.log(`✅ Backup created at ${BACKUP_FILE}`)
} catch (error) {
  console.error('❌ Error creating backup:', error.message)
  process.exit(1)
}

// Migrate each match
const newMatches = oldMatches.map((match, index) => {
  console.log(`\n📝 Migrating match ${index + 1}/${oldMatches.length}: ${match.title || match.id}`)

  // Generate match_id
  const match_id = match.match_id || match.id || `match_${Date.now()}_${index}`

  // Migrate teams
  const teams = {
    home: {
      name: match.teams?.home?.name || match.teamA?.name || 'Équipe A',
      score: match.teams?.home?.score || match.teamA?.score || 0
    },
    away: {
      name: match.teams?.away?.name || match.teamB?.name || 'Équipe B',
      score: match.teams?.away?.score || match.teamB?.score || 0
    }
  }

  // Migrate improvs -> lines
  const improvs = match.lines || match.improvs || []
  const lines = improvs.map((improv, idx) => {
    const line_id = improv.line_id || improv.id || `line_${String(idx + 1).padStart(3, '0')}`

    // Determine line type
    let lineType = 'SEQUENCE' // Default
    if (improv.type) {
      const typeMap = {
        'libre': 'SEQUENCE',
        'contrainte': 'SEQUENCE',
        'emotion': 'SEQUENCE',
        'finale': 'SEQUENCE',
        'pause': 'PAUSE',
        'arrivee': 'ARRIVÉE',
        'echauffement': 'ÉCHAUFFEMENT',
        'presentation': 'PRÉSENTATION',
        'annonce': 'ANNONCE_INTERMEDIAIRE',
        'fin': 'FIN'
      }
      lineType = typeMap[improv.type.toLowerCase()] || 'SEQUENCE'
    }

    // Migrate music: simple string -> 3-point structure
    let music = null
    if (improv.music) {
      if (typeof improv.music === 'string') {
        // Old schema: single music ID
        music = {
          intro: {
            music_id: improv.music,
            settings: {
              play_type: 'full',
              clip_start: null,
              clip_end: null,
              fade_in: 2,
              fade_out: 3,
              volume: 80
            }
          },
          outro: {
            music_id: null,
            settings: {}
          },
          transition: {
            music_id: null,
            settings: {}
          }
        }
      } else if (improv.music.intro || improv.music.outro || improv.music.transition) {
        // Already new schema
        music = improv.music
      }
    }

    return {
      line_id,
      type: lineType,
      title: improv.title || 'Sans titre',
      duration_planned: improv.duration || improv.duration_planned || 120,
      theme: improv.theme || null,
      constraint: improv.constraint || null,
      music,
      status: improv.status || 'pending'
    }
  })

  console.log(`   ✓ Migrated ${lines.length} lines`)
  console.log(`   ✓ Teams: ${teams.home.name} vs ${teams.away.name}`)

  // Build new match
  return {
    match_id,
    title: match.title || 'Match sans titre',
    date: match.date || new Date().toISOString(),
    location: match.location || null,
    teams,
    lines,
    personnel: match.personnel || {
      mc: null,
      sound: null,
      referee: null,
      light: null
    },
    live_state: match.live_state || {
      current_line_id: null,
      chrono_elapsed: 0,
      chrono_status: 'stopped'
    },
    status: match.status || 'draft',
    created_at: match.created_at || match.date || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
})

// Write new schema
try {
  fs.writeFileSync(MATCHES_FILE, JSON.stringify(newMatches, null, 2))
  console.log(`\n✅ Successfully migrated ${newMatches.length} matches`)
  console.log(`✅ New schema written to ${MATCHES_FILE}`)
} catch (error) {
  console.error('❌ Error writing new schema:', error.message)
  console.log('\n⚠️  Restoring backup...')
  fs.copyFileSync(BACKUP_FILE, MATCHES_FILE)
  console.log('✅ Backup restored')
  process.exit(1)
}

// Summary
console.log('\n📊 Migration Summary:')
console.log(`   - Total matches: ${newMatches.length}`)
console.log(`   - Total lines: ${newMatches.reduce((sum, m) => sum + m.lines.length, 0)}`)
console.log(`   - Backup file: ${BACKUP_FILE}`)
console.log('\n🎉 Migration completed successfully!')
console.log('\nYou can now start the application with the new schema.')
console.log('If you encounter issues, restore the backup with:')
console.log(`   cp ${BACKUP_FILE} ${MATCHES_FILE}`)
