/* =====================================================================
   TERRASH-WORLD - RPG Teks 2D ala Undertale
   File: game.js  (v2 - level, skill tree, lantai dungeon, kritis, dinding)
   ===================================================================== */

/* ============================== SPRITE PLAYER (walk-cycle 8 frame per arah) ============================== */
const WALK_CELL_W = 130, WALK_CELL_H = 180, WALK_FRAME_COUNT = 8;
const WALK_SHEETS = {
  down:  { src:"assets/walk_down.png",  img:new Image(), loaded:false },
  up:    { src:"assets/walk_up.png",    img:new Image(), loaded:false },
  left:  { src:"assets/walk_left.png",  img:new Image(), loaded:false },
  right: { src:"assets/walk_right.png", img:new Image(), loaded:false },
};
Object.values(WALK_SHEETS).forEach(rec=>{
  rec.img.onload = ()=>{ rec.loaded = true; };
  rec.img.src = rec.src;
});
function drawPlayerSprite(ctx, x, y, direction, moving){
  direction = direction || "down";
  const rec = WALK_SHEETS[direction] || WALK_SHEETS.down;
  if(!rec.loaded){
    ctx.font="30px serif"; ctx.textAlign="center"; ctx.fillText("🧑", x, y);
    return;
  }
  // 8 frame jalan kalau bergerak (siklus mulus), diam di frame pertama kalau berhenti
  const frame = moving ? Math.floor(Date.now()/90)%WALK_FRAME_COUNT : 0;
  const sx = frame*WALK_CELL_W;
  const drawH = 34, drawW = drawH*(WALK_CELL_W/WALK_CELL_H); // FITUR: samakan skala dgn NPC di lobby
  ctx.drawImage(rec.img, sx, 0, WALK_CELL_W, WALK_CELL_H, x-drawW/2, y-drawH+10, drawW, drawH);
}
function updateFacingFromKeys(keys){
  if(keys.left) player.facing="left";
  else if(keys.right) player.facing="right";
  else if(keys.up) player.facing="up";
  else if(keys.down) player.facing="down";
  return !!(keys.left||keys.right||keys.up||keys.down);
}

/* ============================== SPRITE MONSTER ============================== */
const MONSTER_SPRITES = {
  cave_troll:        { file:"Cave_Healing_Troll.png",   w:32, h:32, frames:2 },
  lime:              { file:"lime.png",                 w:32, h:32, frames:3 },
  large_snake:       { file:"large_snake.png",           w:32, h:32, frames:2 },
  mirrorfiend:       { file:"Mirrorfiend.png",           w:32, h:32, frames:2 },
  jy_titan:          { file:"Junkyard_Titan.png",        w:48, h:48, frames:3 },
  jy_skeleton:       { file:"Junkyard_skeleton.png",     w:32, h:32, frames:2 },
  jy_goblin:         { file:"Junkyard_Goblin.png",       w:32, h:32, frames:2 },
  jy_tinyboxer:      { file:"Junkyard_Tiny_Boxer.png",   w:32, h:32, frames:2 },
  jy_goliath:        { file:"Junkyard_Goliath.png",      w:48, h:48, frames:3 },
  jy_golem:          { file:"Junkyard_Golem.png",        w:32, h:32, frames:2 },
  jy_buffed_titan:   { file:"Junkyard_Buffed_Titan.png", w:48, h:48, frames:3 },
  jy_brute:          { file:"Junkyard_Brute.png",        w:32, h:32, frames:2 },
  green_blob:        { file:"Green_Blob_form_1.png",     w:32, h:32, frames:1 },
  giant_turtle:      { file:"Giant_Turtle.png",          w:32, h:32, frames:2 },
  happy_blob:        { file:"Happy_Blob.png",            w:64, h:64, frames:4 },
  jy_boxer:          { file:"Junkyard_Boxer.png",        w:32, h:32, frames:2 },
  graveyard_guardian:{ file:"Graveyard_Guardian.png",    w:32, h:32, frames:2 },
  goblin_cutthroat:  { file:"Goblin_Cutthroat.png",      w:32, h:32, frames:2 },
  giant_spider:      { file:"Giant_Spider.png",          w:64, h:64, frames:4 },
  frost_yetling:     { file:"Frost_Yetling.png",         w:32, h:32, frames:2 },
  frost_ice_buff:    { file:"Frost_Ice_Buff.png",        w:32, h:32, frames:2 },
  skeleton:          { file:"Skeleton.png",               w:32, h:32, frames:3 },
  skeleton_spearman: { file:"Skeleton_Spearman.png",      w:32, h:32, frames:3 },
  skeleton_warrior:  { file:"Skeleton_Warrior.png",       w:32, h:32, frames:3 },
  skeletal_rat:      { file:"Skeletal_Rat.png",           w:48, h:48, frames:4 },
  skeletal_rat_boss: { file:"Skeletal_Rat_Boss.png",      w:64, h:64, frames:4 },
  spectral_harvester:{ file:"Spectral_Harvester_1.png",   w:48, h:48, frames:2 },
  spectral_hound:    { file:"Spectral_Hound.png",         w:32, h:32, frames:2 },
  spectral_hound2:   { file:"Spectral_Hound_2.png",       w:32, h:32, frames:2 },
  shell_tortoise:    { file:"Shell_Tortoise.png",         w:32, h:32, frames:2 },
  stone_slug:        { file:"Stone_Slug_1.png",           w:32, h:32, frames:3 },
  spiderling_leader: { file:"Spiderling_Swarm_Leader.png",w:32, h:32, frames:4 },
  tiny_spider:       { file:"tiny_spider.png",            w:32, h:32, frames:2 },
  tick:              { file:"tick.png",                   w:32, h:32, frames:1 },
  suspicious_blob:   { file:"Suspicious_Blob.png",        w:32, h:32, frames:4 },
  toxic_pile:        { file:"Toxic_Sludge_Pile.png",      w:48, h:48, frames:3 },
  toxic_skeleton:    { file:"Toxic_Sludge_Skeleton.png",  w:48, h:48, frames:3 },
  toxic_slime:       { file:"Toxic_Sludge_Slime.png",     w:32, h:32, frames:2 },
  toxic_small_pile:  { file:"Toxic_Sludge_Small_Pile.png",w:32, h:32, frames:2 },
  toxic_wisp:        { file:"Toxic_Sludge_wisp.png",      w:32, h:32, frames:2 },
  volcano_drake_boss:{ file:"Volcano_Drake_Boss.png",     w:84, h:84, frames:4 },
  abyss_druid:       { file:"Abyss_Druid.png",             w:32, h:32, frames:2 },
  abyss_fat_gargoyle:{ file:"Abyss_Fat_Gargoyle.png",      w:32, h:32, frames:2 },
  abyss_goblin:      { file:"Abyss_Goblin.png",             w:32, h:32, frames:2 },
  abyss_imp:         { file:"Abyss_Imp.png",                w:32, h:32, frames:2 },
  abyss_lurker:      { file:"Abyss_Lurker.png",             w:32, h:32, frames:2 },
  abyss_minion:      { file:"Abyss_Minion.png",             w:32, h:32, frames:2 },
  abyss_monster:     { file:"Abyss_Monster.png",            w:32, h:32, frames:2 },
  abyss_reaper:      { file:"Abyss_Reaper.png",             w:32, h:32, frames:2 },
  abyss_siren1:      { file:"Abyss_Siren_form_1.png",       w:32, h:32, frames:2 },
  abyss_siren2:      { file:"Abyss_Siren_form_2.png",       w:32, h:32, frames:2 },
  abyss_siren3:      { file:"Abyss_Siren_form_3.png",       w:64, h:64, frames:4 },
  abyss_slug:        { file:"Abyss_Slug.png",               w:32, h:32, frames:4 },
  shell_tortoise3:   { file:"Shell_Tortoise_form_3.png",    w:64, h:64, frames:4 },
  volcano_drakling:  { file:"Volcano_Drakling.png",         w:64, h:64, frames:4 },
  volcano_imp:       { file:"Volcano_Imp.png",              w:32, h:32, frames:2 },
  wierd_traveler:    { file:"Wierd_Traveler.png",           w:32, h:32, frames:2 },
  wisp_wraith1:      { file:"Wisp_Wraith_1.png",            w:32, h:32, frames:2 },
  wisp_wraith2:      { file:"Wisp_Wraith_2.png",            w:32, h:32, frames:2 },
  wisp_wraith3:      { file:"Wisp_Wraith_3.png",            w:48, h:48, frames:2 },
  wisp_wraith4:      { file:"Wisp_Wraith_4.png",            w:32, h:32, frames:2 },
  cave_troll_boss:   { file:"Cave_Troll_Boss.png",           w:64, h:64, frames:4 },
  cave_tiny_troll:   { file:"Cave_Tiny_Troll.png",           w:32, h:32, frames:2 },
  abyss_squid:       { file:"Abyss_Squid.png",               w:32, h:32, frames:2 },
  abyss_tiny_slug:   { file:"Abyss_Tiny_Slug.png",           w:32, h:32, frames:4 },
  chaos_druid:       { file:"Chaos_Druid.png",               w:48, h:48, frames:4 },
  chaos_imp:         { file:"Chaos_Imp.png",                 w:32, h:32, frames:3 },
  chaos_weaver:      { file:"Chaos_Weaver.png",              w:32, h:32, frames:3 },
  clockwork_behemoth:{ file:"Clockwork_Behemoth.png",        w:48, h:48, frames:2 },
  clockwork_imp:     { file:"Clockwork_Imp.png",             w:32, h:32, frames:2 },
  clockwork_soldier: { file:"Clockwork_Soldier.png",         w:32, h:32, frames:2 },
  dust_elemental:    { file:"Dust_Elemental.png",            w:32, h:32, frames:3 },
  dust_elemental_boss:{ file:"Dust_Elemental_Boss.png",      w:64, h:64, frames:4 },
  dust_explosioniate:{ file:"Dust_Explosioniate.png",        w:32, h:32, frames:4 },
  fire_imp:          { file:"Fire_Imp.png",                  w:32, h:32, frames:3 },
  fire_elemental:    { file:"Fire_Elemental.png",             w:32, h:32, frames:4 },
  forest_bushling:   { file:"Forest_Bushling.png",           w:32, h:32, frames:4 },
  forest_boss_imp:   { file:"Forest_Boss_Imp.png",           w:48, h:48, frames:3 },
  forest_girl:       { file:"Forest_Girl.png",                w:32, h:32, frames:3 },
  forest_healing_imp:{ file:"Forest_Healing_Imp.png",        w:32, h:32, frames:2 },
};
Object.values(MONSTER_SPRITES).forEach(m=>{
  m.img = new Image();
  m.loaded = false;
  m.img.onload = ()=>{ m.loaded = true; };
  m.img.src = "assets/monsters/" + m.file;
});

const DUNGEON_MONSTER_POOL = {
  1: ["green_blob","lime","happy_blob","forest_bushling","forest_girl","forest_healing_imp","forest_boss_imp"],
  2: ["large_snake","shell_tortoise","shell_tortoise3","giant_turtle"],
  3: ["goblin_cutthroat","skeleton","skeleton_spearman","skeleton_warrior","skeletal_rat","skeletal_rat_boss"],
  4: ["mirrorfiend","stone_slug","cave_troll","cave_tiny_troll","dust_elemental","dust_explosioniate","cave_troll_boss"],
  5: ["mirrorfiend","spectral_hound","spectral_hound2","spectral_harvester","wisp_wraith1","wisp_wraith2","wisp_wraith3","wisp_wraith4","chaos_druid","chaos_imp","chaos_weaver","graveyard_guardian"],
  6: ["toxic_small_pile","toxic_pile","toxic_slime","toxic_wisp","toxic_skeleton","suspicious_blob","tiny_spider","tick","spiderling_leader","large_snake","giant_spider","volcano_drakling","volcano_drake_boss"],
  7: ["jy_goblin","jy_tinyboxer","jy_boxer","jy_skeleton","jy_brute","jy_golem","jy_goliath","jy_buffed_titan","clockwork_imp","clockwork_soldier","clockwork_behemoth","dust_elemental_boss","jy_titan"],
  8: ["frost_yetling","frost_ice_buff"],
  9: ["abyss_druid","abyss_fat_gargoyle","abyss_goblin","abyss_imp","abyss_lurker","abyss_minion","abyss_monster","abyss_slug","abyss_squid","abyss_tiny_slug","volcano_imp","fire_imp","fire_elemental","abyss_reaper"],
  10:["abyss_siren3"],
};
function pickMonsterSprite(dungeonId, isBoss){
  const pool = DUNGEON_MONSTER_POOL[dungeonId] || ["green_blob"];
  if(isBoss) return pool[pool.length-1];
  const regularPool = pool.length>1 ? pool.slice(0,-1) : pool;
  return regularPool[Math.floor(Math.random()*regularPool.length)];
}
function drawMonsterSprite(ctx, key, x, y, displaySize, animate){
  const m = MONSTER_SPRITES[key];
  if(!m || !m.loaded){
    ctx.font=(displaySize*0.7)+"px serif"; ctx.textAlign="center";
    ctx.fillText("👺", x, y);
    return;
  }
  const frame = animate ? Math.floor(Date.now()/280)%m.frames : 0;
  const sx = frame*m.w;
  ctx.drawImage(m.img, sx, 0, m.w, m.h, x-displaySize/2, y-displaySize+displaySize*0.15, displaySize, displaySize);
}

/* ============================== DATA: TIER (item) ============================== */

const TIERS = [
  { key:"kayu",       name:"Kayu",       mult:1.0,  price:0,     rarity:0 },
  { key:"perunggu",   name:"Perunggu",   mult:1.5,  price:60,    rarity:1 },
  { key:"besi",       name:"Besi",       mult:2.1,  price:180,   rarity:2 },
  { key:"baja",       name:"Baja",       mult:2.9,  price:450,   rarity:3 },
  { key:"perak",      name:"Perak",      mult:3.8,  price:950,   rarity:4 },
  { key:"emas",       name:"Emas",       mult:4.9,  price:1900,  rarity:5 },
  { key:"mithril",    name:"Mithril",    mult:6.2,  price:3600,  rarity:6 },
  { key:"adamantit",  name:"Adamantit",  mult:7.8,  price:6800,  rarity:7 },
  { key:"naga",       name:"Naga",       mult:9.8,  price:13000, rarity:8 },
  { key:"legendaris", name:"Legendaris", mult:12.5, price:26000, rarity:9 },
  { key:"mistis",     name:"Mistis",     mult:16.0, price:42000, rarity:10, crystalReq:"legendaris", crystalCost:3 },
];
// Perluas jadi 50 tingkat untuk item spesial (Busur, Tongkat Sihir, Perisai)
function extendTiers(base, targetCount){
  const out = base.map(t=>({...t}));
  let lastMult = base[base.length-1].mult;
  let lastPrice = base[base.length-1].price;
  for(let i=base.length; i<targetCount; i++){
    lastMult = +(lastMult*1.11).toFixed(2);
    lastPrice = Math.round(lastPrice*1.28);
    const specialCrystal = (i%8===0);
    out.push({
      key:`plus${i+1}`,
      name:`Tingkat+${i+1-base.length}`,
      mult:lastMult,
      price:lastPrice,
      rarity:i,
      crystalReq: specialCrystal ? "mistis" : null,
      crystalCost: specialCrystal ? (1+Math.floor((i-base.length)/10)) : 0
    });
  }
  return out;
}
const TIERS_EXT = extendTiers(TIERS, 50); // 50 tingkat

// Bonus stat acak-tapi-tetap (deterministik) untuk sebagian tingkat: crit%, bonus HP, bonus DEF/ATK
function tierBonus(rarity, category){
  const b = {};
  if(rarity>=2){
    if(rarity%3===0) b.crit = Math.min(40, 2+Math.round(rarity*1.15));
    if(rarity%4===0) b.bonusHp = Math.round(rarity*8);
    if(category==="armor" && rarity%5===0) b.bonusDef = Math.round(2+rarity*0.7);
    if(category==="weapon" && rarity%6===0) b.bonusAtk = Math.round(2+rarity*0.5);
  }
  return b;
}

const WEAPON_TYPES = [
  { name:"Pedang",        icon:"assets/icons/w_pedang.png", baseAtk:5 },
  { name:"Kapak",         icon:"assets/icons/w_kapak.png", baseAtk:7 },
  { name:"Tombak",        icon:"assets/icons/w_tombak.png", baseAtk:6 },
  { name:"Busur",         icon:"assets/icons/w_busur.png", baseAtk:4 },
  { name:"Belati",        icon:"assets/icons/w_belati.png", baseAtk:3 },
  { name:"Palu Perang",   icon:"assets/icons/w_palu.png", baseAtk:8 },
  { name:"Tongkat Sihir", icon:"assets/icons/w_tongkat.png", baseAtk:5 },
];
const ARMOR_TYPES = [
  { name:"Helm",           icon:"assets/icons/a_helm.png", baseDef:3 },
  { name:"Zirah Dada",     icon:"assets/icons/a_zirah.png", baseDef:6 },
  { name:"Sarung Tangan",  icon:"assets/icons/a_sarung.png", baseDef:2 },
  { name:"Sepatu Baja",    icon:"assets/icons/a_sepatu.png", baseDef:2 },
  { name:"Perisai",        icon:"assets/icons/a_perisai.png", baseDef:5 },
];
const AMULET_ELEMENTS = [
  { name:"Api",    icon:"assets/icons/m_api.png" },    { name:"Es",     icon:"assets/icons/m_es.png" },
  { name:"Petir",  icon:"assets/icons/m_petir.png" },  { name:"Racun",  icon:"assets/icons/m_racun.png" },
  { name:"Suci",   icon:"assets/icons/m_suci.png" },   { name:"Gelap",  icon:"assets/icons/m_gelap.png" },
  { name:"Angin",  icon:"assets/icons/m_angin.png" },  { name:"Bumi",   icon:"assets/icons/m_bumi.png" },
  { name:"Waktu",  icon:"assets/icons/m_waktu.png" },  { name:"Darah",  icon:"assets/icons/m_darah.png" },
];
const AMULET_TIERS = [
  { key:"biasa",      name:"Biasa",      mult:1.0, price:200 },
  { key:"langka",     name:"Langka",     mult:1.8, price:1200 },
  { key:"epik",       name:"Epik",       mult:3.0, price:5000 },
  { key:"mistis",     name:"Mistis",     mult:5.0, price:18000 },
  { key:"legendaris", name:"Legendaris", mult:8.0, price:40000 },
];

function genWeapons(){
  const out = [];
  WEAPON_TYPES.forEach(t=>{
    const special = (t.name==="Busur" || t.name==="Tongkat Sihir");
    const list = special ? TIERS_EXT : TIERS;
    list.forEach(tier=>{
      const bonus = tierBonus(tier.rarity, "weapon");
      out.push({
        id:`w_${t.name}_${tier.key}`.replace(/\s+/g,''),
        cat:"weapon",
        name:`${tier.name} ${t.name}`,
        icon:t.icon,
        atk: Math.round(t.baseAtk*tier.mult),
        price: tier.price,
        tier: tier.key,
        rarity: tier.rarity,
        crystalReq: tier.crystalReq||null,
        crystalCost: tier.crystalCost||0,
        starter: tier.key==="kayu",
        crit: bonus.crit||0,
        bonusHp: bonus.bonusHp||0,
        bonusAtk: bonus.bonusAtk||0,
      });
    });
  });
  return out;
}
function genArmors(){
  const out = [];
  ARMOR_TYPES.forEach(t=>{
    const special = (t.name==="Perisai");
    const list = special ? TIERS_EXT : TIERS;
    list.forEach(tier=>{
      const bonus = tierBonus(tier.rarity, "armor");
      out.push({
        id:`a_${t.name}_${tier.key}`.replace(/\s+/g,''),
        cat:"armor",
        name:`${tier.name} ${t.name}`,
        icon:t.icon,
        def: Math.round(t.baseDef*tier.mult),
        price: tier.price,
        tier: tier.key,
        rarity: tier.rarity,
        crystalReq: tier.crystalReq||null,
        crystalCost: tier.crystalCost||0,
        starter: tier.key==="kayu",
        crit: bonus.crit||0,
        bonusHp: bonus.bonusHp||0,
        bonusDef: bonus.bonusDef||0,
      });
    });
  });
  return out;
}
function genAmulets(){
  const out = [];
  AMULET_ELEMENTS.forEach(e=>{
    AMULET_TIERS.forEach((tier,ti)=>{
      const bonus = tierBonus(ti, "amulet");
      out.push({
        id:`m_${e.name}_${tier.key}`.replace(/\s+/g,''),
        cat:"amulet",
        name:`${tier.name} Amulet ${e.name}`,
        icon:e.icon,
        element: e.name,
        atk: Math.round(4*tier.mult),
        def: Math.round(2*tier.mult),
        price: tier.price,
        tier: tier.key,
        crit: (e.name==="Petir"||e.name==="Darah") ? Math.round(4+ti*3) : (bonus.crit||0),
        bonusHp: bonus.bonusHp||0,
      });
    });
  });
  return out;
}

const WEAPONS = genWeapons();
const ARMORS  = genArmors();
const AMULETS = genAmulets();

const POTIONS = [
  {id:"p_heal_kecil", name:"Ramuan Penyembuh Kecil", icon:"🧪", effect:"heal", value:30, price:20},
  {id:"p_heal_sedang", name:"Ramuan Penyembuh Sedang", icon:"🧪", effect:"heal", value:70, price:55},
  {id:"p_heal_besar", name:"Ramuan Penyembuh Besar", icon:"🧪", effect:"heal", value:150, price:130},
  {id:"p_heal_super", name:"Ramuan Penyembuh Super", icon:"🧪", effect:"heal", value:300, price:280},
  {id:"p_heal_penuh", name:"Ramuan Penyembuh Total", icon:"💠", effect:"healfull", value:9999, price:600},
  {id:"p_atk_kecil", name:"Ramuan Kekuatan Kecil", icon:"🔴", effect:"buffAtk", value:5, duration:3, price:40},
  {id:"p_atk_sedang", name:"Ramuan Kekuatan Sedang", icon:"🔴", effect:"buffAtk", value:12, duration:3, price:100},
  {id:"p_atk_besar", name:"Ramuan Kekuatan Besar", icon:"🔴", effect:"buffAtk", value:25, duration:3, price:250},
  {id:"p_def_kecil", name:"Ramuan Pertahanan Kecil", icon:"🔵", effect:"buffDef", value:4, duration:3, price:40},
  {id:"p_def_sedang", name:"Ramuan Pertahanan Sedang", icon:"🔵", effect:"buffDef", value:10, duration:3, price:100},
  {id:"p_def_besar", name:"Ramuan Pertahanan Besar", icon:"🔵", effect:"buffDef", value:20, duration:3, price:250},
  {id:"p_antidot", name:"Penawar Racun", icon:"🟢", effect:"cure", value:0, price:35},
  {id:"p_kecepatan", name:"Ramuan Kecepatan", icon:"🟡", effect:"dodgeBoost", value:15, duration:3, price:120},
  {id:"p_keberuntungan", name:"Ramuan Keberuntungan", icon:"🍀", effect:"luck", value:10, duration:5, price:150},
  {id:"p_darah_naga", name:"Darah Naga", icon:"🩸", effect:"heal", value:500, price:900},
  {id:"p_air_suci", name:"Air Suci", icon:"💧", effect:"healfull", value:9999, price:1200},
  {id:"p_elixir", name:"Elixir Misterius", icon:"⚗️", effect:"buffAll", value:15, duration:4, price:1600},
  {id:"p_revive", name:"Batu Kebangkitan", icon:"🪨", effect:"revive", value:0, price:2500},
  {id:"p_madu_hutan", name:"Madu Hutan Purba", icon:"🍯", effect:"heal", value:90, price:70},
  {id:"p_ramuan_beku", name:"Ramuan Anti Beku", icon:"🧊", effect:"cure", value:0, price:35},
  {id:"p_teh_herbal", name:"Teh Herbal Guild", icon:"🍵", effect:"heal", value:45, price:30},
  {id:"p_serum_baja", name:"Serum Kulit Baja", icon:"🥤", effect:"buffDef", value:35, duration:3, price:500},
  {id:"p_bubuk_kilat", name:"Bubuk Kilat", icon:"✨", effect:"dodgeBoost", value:30, duration:2, price:400},
  {id:"p_darah_iblis", name:"Darah Iblis", icon:"🔺", effect:"buffAtk", value:40, duration:3, price:700},
];

/* ============================== DATA: SKILL TREE (nama & efek sesuai file 99_efek_skill_pixel) ============================== */

// 60 efek elemen: 15 elemen x 4 tingkat (Ledakan awal -> makin kuat), tiap file spritesheet 6-frame 128x128
const ELEMENT_SKILL_DATA = [
  { element:"Api", effect:"Ledakan", file:"01_Api_Ledakan.png" },
  { element:"Api", effect:"Tebasan", file:"02_Api_Tebasan.png" },
  { element:"Api", effect:"Dinding", file:"03_Api_Dinding.png" },
  { element:"Api", effect:"Bola", file:"04_Api_Bola.png" },
  { element:"Es", effect:"Ledakan", file:"05_Es_Ledakan.png" },
  { element:"Es", effect:"Gelombang", file:"06_Es_Gelombang.png" },
  { element:"Es", effect:"Perisai", file:"07_Es_Perisai.png" },
  { element:"Es", effect:"Cincin", file:"08_Es_Cincin.png" },
  { element:"Petir", effect:"Sambaran", file:"09_Petir_Sambaran.png" },
  { element:"Petir", effect:"Rantai", file:"10_Petir_Rantai.png" },
  { element:"Petir", effect:"Badai", file:"11_Petir_Badai.png" },
  { element:"Petir", effect:"Dash", file:"12_Petir_Dash.png" },
  { element:"Angin", effect:"Tebasan", file:"13_Angin_Tebasan.png" },
  { element:"Angin", effect:"Pusaran", file:"14_Angin_Pusaran.png" },
  { element:"Angin", effect:"Badai", file:"15_Angin_Badai.png" },
  { element:"Angin", effect:"Proyektil", file:"16_Angin_Proyektil.png" },
  { element:"Arcana", effect:"Rune", file:"17_Arcana_Rune.png" },
  { element:"Arcana", effect:"Gelombang", file:"18_Arcana_Gelombang.png" },
  { element:"Arcana", effect:"Ledakan", file:"19_Arcana_Ledakan.png" },
  { element:"Arcana", effect:"Lingkaran", file:"20_Arcana_Lingkaran.png" },
  { element:"Cahaya", effect:"Sinar", file:"21_Cahaya_Sinar.png" },
  { element:"Cahaya", effect:"Aura", file:"22_Cahaya_Aura.png" },
  { element:"Cahaya", effect:"Beam", file:"23_Cahaya_Beam.png" },
  { element:"Cahaya", effect:"Perisai", file:"24_Cahaya_Perisai.png" },
  { element:"Kegelapan", effect:"Tebasan", file:"25_Kegelapan_Tebasan.png" },
  { element:"Kegelapan", effect:"Nova", file:"26_Kegelapan_Nova.png" },
  { element:"Kegelapan", effect:"Retakan", file:"27_Kegelapan_Retakan.png" },
  { element:"Kegelapan", effect:"Hujan", file:"28_Kegelapan_Hujan.png" },
  { element:"Racun", effect:"Dart", file:"29_Racun_Dart.png" },
  { element:"Racun", effect:"Awan", file:"30_Racun_Awan.png" },
  { element:"Racun", effect:"Pisau", file:"31_Racun_Pisau.png" },
  { element:"Racun", effect:"Wabah", file:"32_Racun_Wabah.png" },
  { element:"Suara", effect:"Gelombang", file:"33_Suara_Gelombang.png" },
  { element:"Suara", effect:"Boom", file:"34_Suara_Boom.png" },
  { element:"Suara", effect:"Diam", file:"35_Suara_Diam.png" },
  { element:"Suara", effect:"Gema", file:"36_Suara_Gema.png" },
  { element:"Ruang", effect:"Medan", file:"37_Ruang_Medan.png" },
  { element:"Ruang", effect:"Lubang", file:"38_Ruang_Lubang.png" },
  { element:"Ruang", effect:"Warp", file:"39_Ruang_Warp.png" },
  { element:"Ruang", effect:"Distorsi", file:"40_Ruang_Distorsi.png" },
  { element:"Kilatan", effect:"Bolt", file:"41_Kilatan_Bolt.png" },
  { element:"Kilatan", effect:"Storm", file:"42_Kilatan_Storm.png" },
  { element:"Kilatan", effect:"Armor", file:"43_Kilatan_Armor.png" },
  { element:"Kilatan", effect:"Angin Dingin", file:"44_Kilatan_Angin_Dingin.png" },
  { element:"Tanah", effect:"Ledakan", file:"45_Tanah_Ledakan.png" },
  { element:"Tanah", effect:"Medan", file:"46_Tanah_Medan.png" },
  { element:"Tanah", effect:"Kapsul", file:"47_Tanah_Kapsul.png" },
  { element:"Tanah", effect:"Overload", file:"48_Tanah_Overload.png" },
  { element:"Air", effect:"Spike", file:"49_Air_Spike.png" },
  { element:"Air", effect:"Pilar", file:"50_Air_Pilar.png" },
  { element:"Air", effect:"Batu", file:"51_Air_Batu.png" },
  { element:"Air", effect:"Quake", file:"52_Air_Quake.png" },
  { element:"Energi", effect:"Splash", file:"53_Energi_Splash.png" },
  { element:"Energi", effect:"Arus", file:"54_Energi_Arus.png" },
  { element:"Energi", effect:"Perisai", file:"55_Energi_Perisai.png" },
  { element:"Energi", effect:"Whirlpool", file:"56_Energi_Whirlpool.png" },
  { element:"Kosmik", effect:"Burst", file:"57_Kosmik_Burst.png" },
  { element:"Kosmik", effect:"Orb", file:"58_Kosmik_Orb.png" },
  { element:"Kosmik", effect:"Gelombang", file:"59_Kosmik_Gelombang.png" },
  { element:"Kosmik", effect:"Meteor", file:"60_Kosmik_Meteor.png" },
];
// 21 skill mastery senjata (dipelajari berurutan, bonus ATK tetap, berlaku terlepas dari senjata yg dipakai)
const MASTERY_SKILL_DATA = [
  { name:"Sword Mastery", file:"01_Sword_Mastery.png" },
  { name:"Axe Mastery", file:"02_Axe_Mastery.png" },
  { name:"Spear Mastery", file:"03_Spear_Mastery.png" },
  { name:"Bow Mastery", file:"04_Bow_Mastery.png" },
  { name:"Crossbow Mastery", file:"05_Crossbow_Mastery.png" },
  { name:"Staff Mastery", file:"06_Staff_Mastery.png" },
  { name:"Dagger Mastery", file:"07_Dagger_Mastery.png" },
  { name:"Greatsword Mastery", file:"08_Greatsword_Mastery.png" },
  { name:"Hammer Mastery", file:"09_Hammer_Mastery.png" },
  { name:"Katana Mastery", file:"10_Katana_Mastery.png" },
  { name:"Dual Blade Mastery", file:"11_Dual_Blade_Mastery.png" },
  { name:"Gun Mastery", file:"12_Gun_Mastery.png" },
  { name:"Whip Mastery", file:"13_Whip_Mastery.png" },
  { name:"Polearm Mastery", file:"14_Polearm_Mastery.png" },
  { name:"Fist Mastery", file:"15_Fist_Mastery.png" },
  { name:"Shield Mastery", file:"16_Shield_Mastery.png" },
  { name:"Magic Blade Mastery", file:"17_Magic_Blade_Mastery.png" },
  { name:"Ranged Mastery", file:"18_Ranged_Mastery.png" },
  { name:"Elemental Weapon Mastery", file:"19_Elemental_Weapon_Mastery.png" },
  { name:"Critical Strike Mastery", file:"20_Critical_Strike_Mastery.png" },
  { name:"Combo Mastery", file:"21_Combo_Mastery.png" },
];
// 18 skill unik (didapat gratis tiap kalahkan bos, tidak perlu poin skill)
const UNIQUE_SKILL_DATA = [
  { name:"Transcendence", file:"01_Transcendence.png" },
  { name:"Shadow Step", file:"02_Shadow_Step.png" },
  { name:"Time Stop", file:"03_Time_Stop.png" },
  { name:"Summon Beast", file:"04_Summon_Beast.png" },
  { name:"Phoenix Rebirth", file:"05_Phoenix_Rebirth.png" },
  { name:"Reality Warp", file:"06_Reality_Warp.png" },
  { name:"Soul Harvest", file:"07_Soul_Harvest.png" },
  { name:"Demon Form", file:"08_Demon_Form.png" },
  { name:"Elemental Fusion", file:"09_Elemental_Fusion.png" },
  { name:"Mana Shield", file:"10_Mana_Shield.png" },
  { name:"Illusion", file:"11_Illusion.png" },
  { name:"Stealth", file:"12_Stealth.png" },
  { name:"Dragon Roar", file:"13_Dragon_Roar.png" },
  { name:"Meteor Shower", file:"14_Meteor_Shower.png" },
  { name:"Gravity Pull", file:"15_Gravity_Pull.png" },
  { name:"Soul Link", file:"16_Soul_Link.png" },
  { name:"Life Exchange", file:"17_Life_Exchange.png" },
  { name:"Final Stand", file:"18_Final_Stand.png" },
];

function genSkills(){
  const out = [];
  const tierCost = [1,1,2,3], tierMult = [1.6,2.4,3.4,4.8], tierCd = [1,2,2,3];
  ELEMENT_SKILL_DATA.forEach((entry,i)=>{
    const tier = i%4; // tiap elemen tepat 4 efek berurutan
    out.push({
      id:`sk_el_${entry.element}_${entry.effect}`.replace(/\s+/g,''),
      type:"attack",
      element: entry.element,
      name:`${entry.element} ${entry.effect}`,
      mult: tierMult[tier],
      cd: tierCd[tier],
      source: "tree",
      branch: `el_${entry.element}`,
      tier: tier,
      cost: tierCost[tier],
      effectFile: `assets/skill_effects/element/${entry.file}`,
      desc:`Serangan elemen ${entry.element}: ${entry.effect}.`
    });
  });
  MASTERY_SKILL_DATA.forEach((entry,i)=>{
    const bonusAtk = 3 + i*2;
    out.push({
      id:`sk_mastery_${i}`,
      type:"passive",
      name: entry.name,
      bonusAtk,
      source:"tree",
      branch:"weapon_mastery",
      tier: i,
      cost: 1+Math.floor(i/6),
      effectFile: `assets/skill_effects/mastery/${entry.file}`,
      desc:`Bonus serangan tetap +${bonusAtk} ATK (berlaku di senjata apa pun).`
    });
  });
  UNIQUE_SKILL_DATA.forEach((entry,i)=>{
    out.push({
      id:`sk_unique_${i}`,
      type:"attack",
      element:"Unik",
      name: entry.name,
      mult: 4.5 + i*0.3,
      cd: 3,
      source:"boss",
      effectFile: `assets/skill_effects/unique/${entry.file}`,
      desc:`Jurus rahasia hasil kalahkan bos: ${entry.name}.`
    });
  });
  return out;
}
const SKILLS = genSkills();
function skillBranchChain(branch){
  return SKILLS.filter(s=>s.branch===branch).sort((a,b)=>a.tier-b.tier);
}
function skillTreeBranches(){
  const branches = {};
  SKILLS.filter(s=>s.source==="tree").forEach(s=>{
    branches[s.branch] = branches[s.branch]||[];
    branches[s.branch].push(s);
  });
  Object.values(branches).forEach(arr=>arr.sort((a,b)=>a.tier-b.tier));
  return branches;
}
function canLearnTreeSkill(s){
  if(player.skills.includes(s.id)) return false;
  if(player.skillPoints < s.cost) return false;
  if(s.tier>0){
    const chain = skillBranchChain(s.branch);
    const prev = chain[s.tier-1];
    if(!prev || !player.skills.includes(prev.id)) return false;
  }
  return true;
}
function learnTreeSkill(id){
  const s = getSkill(id);
  if(!s || !canLearnTreeSkill(s)) return;
  player.skills.push(id);
  player.skillPoints -= s.cost;
  persist();
  renderSkillTree();
}

/* ============================== DATA: DUNGEON ============================== */

const DUNGEONS = [
  { id:1, name:"Reruntuhan Hutan Purba", bg:"01_reruntuhan_hutan_purba.png", element:"Bumi",   boss:"Raja Serigala Tunggul", monsterName:"Serigala Hutan" },
  { id:2, name:"Rawa Beracun",           bg:"02_rawa_beracun.png",           element:"Racun",  boss:"Ratu Lintah Rawa",      monsterName:"Siluman Rawa" },
  { id:3, name:"Kuburan Terkutuk",       bg:"03_kuburan_terkutuk.png",       element:"Gelap",  boss:"Penjaga Hutan Terkutuk",monsterName:"Mayat Berjalan" },
  { id:4, name:"Gua Kristal Biru",       bg:"04_gua_kristal_biru.png",       element:"Bumi",   boss:"Golem Kristal Purba",   monsterName:"Kelelawar Kristal" },
  { id:5, name:"Reruntuhan Tenggelam",   bg:"05_reruntuhan_tenggelam.png",   element:"Air",    boss:"Penjaga Reruntuhan",    monsterName:"Patung Hidup" },
  { id:6, name:"Gua Api",                bg:"06_gua_api.png",                element:"Api",    boss:"Naga Lahar Purba",      monsterName:"Salamander Lahar" },
  { id:7, name:"Kuil Mesin Kuno",        bg:"07_kuil_mesin_kuno.png",        element:"Baja",   boss:"Kesatria Baja Terkutuk",monsterName:"Prajurit Bayangan" },
  { id:8, name:"Gua Es",                 bg:"08_gua_es.png",                 element:"Es",     boss:"Naga Es Abadi",         monsterName:"Serigala Es" },
  { id:9, name:"Jurang Bayangan",        bg:"09_jurang_bayangan.png",        element:"Gelap",  boss:"Iblis Penjaga Jurang",  monsterName:"Iblis Kecil" },
  { id:10,name:"Kuil Terlarang",         bg:"10_kuil_terlarang.png",         element:"Gelap",  boss:"Penguasa Kegelapan", monsterName:null, finalBoss:true },
];
const DUNGEON_BG_IMAGES = {};
DUNGEONS.forEach(d=>{
  const img = new Image();
  const rec = { img, loaded:false };
  img.onload = ()=>{ rec.loaded = true; };
  img.src = `assets/dungeon_bg/${d.bg}`;
  DUNGEON_BG_IMAGES[d.id] = rec;
});
function dungeonFloors(id){ if(id<=5) return 5; if(id<=9) return 10; return 1; }
function monstersPerSubfloor(id){ return 4+id; }
function difficultyValue(dungeonId, subFloor){
  const total = dungeonFloors(dungeonId);
  return dungeonId + (subFloor-1)/Math.max(1,total);
}
// FIX/FITUR: dinding tak terlihat sekarang dipetakan MANUAL per gambar dungeon (bukan tebakan
// generik lagi) — tiap dungeon punya kotak halangan sendiri sesuai pohon/batu/patung/lava/pagar
// yg benar-benar ada di gambarnya. Koridor menuju pintu keluar (kiri) & tangga/bos (kanan) selalu
// bisa dilewati apa pun rintangan lainnya, supaya progres tidak pernah terkunci.
const DUNGEON_COLLISION = {
  1: [ [0,0,700,85], [0,185,60,255], [0,345,60,400], [30,85,66,290], [175,75,215,195], [460,75,500,290], [555,75,595,270], [660,85,700,400] ], // Reruntuhan Hutan Purba
  2: [ [0,0,270,170], [430,0,700,170], [90,255,270,345], [90,230,270,255], [0,345,270,400], [430,230,700,400] ], // Rawa Beracun: jalan batu tengah + jembatan, celah pintu/tangga dijaga tetap kebuka
  3: [ [0,0,700,80], [90,80,290,300], [430,80,620,300] ], // Kuburan Terkutuk
  4: [ [0,0,700,75], [75,25,265,175], [385,20,470,175], [585,10,685,360] ], // Gua Kristal Biru
  5: [ [0,0,700,75], [65,175,110,380], [175,115,225,275], [480,135,530,315], [665,55,700,175] ], // Reruntuhan Tenggelam
  6: [ [0,0,700,75], [90,75,246,255], [90,345,246,400], [446,75,610,135], [446,305,610,400] ], // Gua Api: lava kiri-kanan, celah pintu/tangga dijaga tetap kebuka
  7: [ [0,0,700,75], [220,10,270,175], [430,10,480,175], [115,255,240,365], [560,240,660,360] ], // Kuil Mesin Kuno
  8: [ [0,0,700,75], [260,10,300,175], [440,10,480,160], [15,10,90,200], [655,10,700,190] ], // Gua Es
  9: [ [0,0,700,75], [90,75,210,255], [90,345,210,400], [455,75,610,135], [455,305,610,400] ], // Jurang Bayangan: platform tengah, celah pintu/tangga dijaga tetap kebuka
  10:[ [0,0,700,80], [75,10,120,392], [600,10,645,392], [290,330,440,400] ], // Kuil Terlarang
};
function canMoveInDungeon(px, py, canvas, dungeonId){
  if(px<=50 && Math.abs(py-300)<45) return true; // koridor pintu keluar — selalu bisa
  if(px>=612 && py>135 && py<305) return true;   // koridor tangga/bos — selalu bisa
  const blocks = DUNGEON_COLLISION[dungeonId] || [];
  for(const r of blocks){
    if(px>r[0] && px<r[2] && py>r[1] && py<r[3]) return false;
  }
  return true;
}
// Cari titik spawn monster yg valid (di luar semua kotak halangan) dgn coba-coba acak — jadi
// otomatis pas dgn bentuk jalan dungeon manapun tanpa perlu diatur manual satu-satu.
function findWalkableSpawn(dungeonId){
  for(let i=0;i<40;i++){
    const x = 100 + Math.random()*520;
    const y = 90 + Math.random()*270;
    if(canMoveInDungeon(x, y, {width:700,height:400}, dungeonId)) return {x,y};
  }
  return {x:350, y:200};
}

const BOSS_DIALOGUE = {
  "Raja Serigala Tunggul": ["Grrrhh... manusia berani masuk wilayahku!","Rasakan gigitan terakhirmu!"],
  "Ratu Lintah Rawa": ["Rawa ini akan menjadi kuburanmu...","Darahmu akan jadi santapanku!"],
  "Penjaga Hutan Terkutuk": ["Kutukan ini... akan menular padamu juga.","Kegelapan tak pernah tidur..."],
  "Golem Kristal Purba": ["...INTRUSI TERDETEKSI...","...MENGHANCURKAN..."],
  "Penjaga Reruntuhan": ["Waktu telah melupakanku, tapi aku tidak lupa caramu menghancurkanku!"],
  "Naga Rawa Beracun": ["Hirup racunku, manusia lemah!","Kau akan membusuk perlahan..."],
  "Kesatria Baja Terkutuk": ["Baju zirah ini menyimpan seribu jiwa yang gagal sepertimu.","Bergabunglah dengan mereka!"],
  "Naga Es Abadi": ["Ribuan tahun aku membeku di sini... kini giliranmu.","Rasakan dinginnya kematian!"],
  "Iblis Penjaga Jurang": ["Jurang ini adalah pintu neraka, dan kau tamunya!","Api ini tak akan pernah padam!"],
  "Penguasa Kegelapan": [
    "Akhirnya... seseorang berhasil sampai sejauh ini.",
    "Kau membawa kristal-kristal itu... menarik.",
    "Tapi keberanianmu berakhir di sini, pengelana.",
    "Rasakan kekuatan kegelapan sejati!"
  ]
};

/* ============================== DATA: KRISTAL ============================== */

const CRYSTAL_TYPES = [
  { key:"biasa",      name:"Kristal Biasa",      icon:"🔹", sellRate:10 },
  { key:"langka",     name:"Kristal Langka",     icon:"🔷", sellRate:80 },
  { key:"epik",       name:"Kristal Epik",       icon:"💎", sellRate:500 },
  { key:"mistis",     name:"Kristal Mistis",     icon:"🟣", sellRate:3000 },
  { key:"legendaris", name:"Kristal Legendaris", icon:"🌟", sellRate:20000 },
  { key:"dewa",       name:"Kristal Dewa",       icon:"👑", sellRate:150000 },
];

/* ============================== CURRENCY HELPERS ============================== */
function coinToDisplay(totalPerunggu){
  let sisa = totalPerunggu;
  const platinum = Math.floor(sisa/1000000); sisa -= platinum*1000000;
  const gold = Math.floor(sisa/10000); sisa -= gold*10000;
  const perak = Math.floor(sisa/100); sisa -= perak*100;
  const perunggu = sisa;
  return {platinum, gold, perak, perunggu};
}
function formatCoin(totalPerunggu){
  const c = coinToDisplay(totalPerunggu);
  const parts = [];
  if(c.platinum) parts.push(`${c.platinum}P`);
  if(c.gold) parts.push(`${c.gold}G`);
  if(c.perak) parts.push(`${c.perak}S`);
  parts.push(`${c.perunggu}C`);
  return parts.join(" ");
}

/* ============================== AKUN & LOGIN ============================== */

const STORAGE_KEY = "kristalsaga_accounts_v1";
function loadAccounts(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }catch(e){ return {}; }
}
function saveAccounts(acc){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(acc));
}
let ACCOUNTS = loadAccounts();
let player = null;

function xpForLevel(lvl){ return Math.round(35*Math.pow(lvl,1.45)); }
function computeMaxHp(p){
  p = p || player;
  let hp = 80 + p.level*12;
  const w = getWeapon(p.equipped.weapon), a = getArmor(p.equipped.armor), am = getAmulet(p.equipped.amulet);
  [w,a,am].forEach(it=>{ if(it && it.bonusHp) hp += it.bonusHp; });
  return hp;
}

function makeNewPlayer(username, email){
  const p = {
    username, email,
    level:1, xp:0, skillPoints:0,
    hp:100, maxHp:100,
    baseAtk:3, baseDef:1,
    coins:0,
    crystals:{ biasa:0, langka:0, epik:0, mistis:0, legendaris:0, dewa:0 },
    inventory:{ weapons:["w_Pedang_kayu"], armors:[], amulets:[], potions:{"p_heal_kecil":1} },
    equipped:{ weapon:"w_Pedang_kayu", armor:null, amulet:null },
    skills:[],
    maxFloorReached:0,
    dungeonCleared:{},
    dungeonSubProgress:{},
    currentFloor:0, // 0 = lobby, else id dungeon 1-10
    currentSubFloor:1,
    floorProgress:{}, // {"dungeonId_subFloor": monstersKilled}
    pos:{x:330,y:280},
    facing:"down",
    isMoving:false,
    upgradeLevels:{},
  };
  p.maxHp = computeMaxHp(p);
  p.hp = p.maxHp;
  return p;
}
function getUpgradeLevel(itemId){ return (player.upgradeLevels && player.upgradeLevels[itemId]) || 0; }

function registerAccount(username, password, email){
  if(ACCOUNTS[username]) return {ok:false, msg:"Username sudah terdaftar."};
  if(!username || !password) return {ok:false, msg:"Username & sandi wajib diisi."};
  ACCOUNTS[username] = { password, email, save: makeNewPlayer(username, email) };
  saveAccounts(ACCOUNTS);
  return {ok:true};
}
function loginAccount(username, password){
  const acc = ACCOUNTS[username];
  if(!acc) return {ok:false, msg:"Akun tidak ditemukan."};
  if(acc.password !== password) return {ok:false, msg:"Sandi salah."};
  player = acc.save;
  // migrasi save lama yang belum punya field baru
  if(player.level===undefined) player.level=1;
  if(player.xp===undefined) player.xp=0;
  if(player.skillPoints===undefined) player.skillPoints=0;
  if(player.currentSubFloor===undefined) player.currentSubFloor=1;
  if(!player.floorProgress) player.floorProgress={};
  if(!player.dungeonCleared) player.dungeonCleared={};
  if(!player.dungeonSubProgress) player.dungeonSubProgress={};
  if(player.skills) player.skills = player.skills.filter(id=> id.indexOf("sk_dodge")!==0 );
  player.maxHp = computeMaxHp();
  if(player.hp>player.maxHp) player.hp = player.maxHp;
  // Akun owner: koin selalu di-refill ke jumlah sangat besar tiap login
  if(username==="Alfian" && password==="12345678" && (acc.email||"")==="lidyahelim@gmail.com"){
    player.coins = 999999999999;
    persist();
  }
  return {ok:true};
}
function persist(){
  if(!player) return;
  if(!ACCOUNTS[player.username]) ACCOUNTS[player.username] = {password:"", email:player.email, save:player};
  ACCOUNTS[player.username].save = player;
  saveAccounts(ACCOUNTS);
}

/* ============================== ITEM LOOKUP HELPERS ============================== */
function getWeapon(id){ return WEAPONS.find(w=>w.id===id); }
function getArmor(id){ return ARMORS.find(a=>a.id===id); }
function getAmulet(id){ return AMULETS.find(a=>a.id===id); }
function getPotion(id){ return POTIONS.find(p=>p.id===id); }
function getSkill(id){ return SKILLS.find(s=>s.id===id); }

function playerTotalAtk(){
  let atk = player.baseAtk;
  const w = getWeapon(player.equipped.weapon);
  if(w){ atk += w.atk + getUpgradeLevel(w.id)*4; atk += (w.bonusAtk||0); }
  const a = getArmor(player.equipped.armor);
  if(a) atk += (a.bonusAtk||0);
  const am = getAmulet(player.equipped.amulet);
  if(am) atk += am.atk + (am.bonusAtk||0);
  atk += getWeaponMasteryBonus();
  return atk;
}
function getWeaponMasteryBonus(){
  let bonus = 0;
  player.skills.forEach(sid=>{
    const s = getSkill(sid);
    if(s && s.type==="passive" && s.branch==="weapon_mastery") bonus += s.bonusAtk;
  });
  return bonus;
}
function playerTotalDef(){
  let def = player.baseDef;
  const w = getWeapon(player.equipped.weapon);
  if(w) def += (w.bonusDef||0);
  const a = getArmor(player.equipped.armor);
  if(a){ def += a.def + getUpgradeLevel(a.id)*3; def += (a.bonusDef||0); }
  const am = getAmulet(player.equipped.amulet);
  if(am) def += am.def + (am.bonusDef||0);
  return def;
}
function playerTotalCrit(){
  let c = 0;
  const w = getWeapon(player.equipped.weapon); if(w) c += (w.crit||0);
  const a = getArmor(player.equipped.armor); if(a) c += (a.crit||0);
  const am = getAmulet(player.equipped.amulet); if(am) c += (am.crit||0);
  return c;
}

/* ============================== DAMAGE FORMULA ============================== */
// Mitigasi persentase (diminishing returns) supaya defense tinggi tidak membuat damage nyaris 0,
// tapi tetap terasa berarti. dmg efektif = atk * 12/(12+def)
function mitigatedDamage(atk, def){
  const mitig = Math.max(0, def) / (Math.max(0,def) + 12);
  return Math.max(1, Math.round(atk * (1-mitig)));
}

/* ============================== MONSTER ============================== */

// Nama per-sprite supaya nama monster selalu cocok dgn gambar yg tampil (sebelumnya 1 nama tetap
// dipakai untuk seluruh sprite acak dalam 1 dungeon, jadi sering nggak nyambung sama gambarnya).
const MONSTER_SPRITE_NAMES = {
  green_blob:"Lendir Hijau", lime:"Slime Limau", happy_blob:"Lendir Ceria",
  forest_bushling:"Semak Berjalan", forest_girl:"Peri Hutan", forest_healing_imp:"Iblis Penyembuh Hutan",
  forest_boss_imp:"Raja Serigala Tunggul",
  large_snake:"Ular Raksasa", shell_tortoise:"Kura-Kura Cangkang", shell_tortoise3:"Kura-Kura Cangkang Keras",
  giant_turtle:"Kura-Kura Raksasa",
  goblin_cutthroat:"Goblin Perampok", skeleton:"Tengkorak", skeleton_spearman:"Tengkorak Bertombak",
  skeleton_warrior:"Tengkorak Prajurit", skeletal_rat:"Tikus Tengkorak", skeletal_rat_boss:"Raja Tikus Tengkorak",
  mirrorfiend:"Iblis Cermin", stone_slug:"Siput Batu", cave_troll:"Troll Gua", cave_tiny_troll:"Troll Gua Kecil",
  dust_elemental:"Elemental Debu", dust_explosioniate:"Debu Meledak", cave_troll_boss:"Troll Gua Agung",
  spectral_hound:"Anjing Hantu", spectral_hound2:"Anjing Hantu Ganas", spectral_harvester:"Penuai Arwah",
  wisp_wraith1:"Roh Api Kecil", wisp_wraith2:"Roh Api", wisp_wraith3:"Roh Api Besar", wisp_wraith4:"Roh Api Ganas",
  chaos_druid:"Druid Kekacauan", chaos_imp:"Iblis Kekacauan", chaos_weaver:"Penenun Kekacauan",
  graveyard_guardian:"Penjaga Kuburan",
  toxic_small_pile:"Tumpukan Racun Kecil", toxic_pile:"Tumpukan Racun", toxic_slime:"Lendir Beracun",
  toxic_wisp:"Roh Racun", toxic_skeleton:"Tengkorak Beracun", suspicious_blob:"Lendir Mencurigakan",
  tiny_spider:"Laba-Laba Kecil", tick:"Kutu Raksasa", spiderling_leader:"Pemimpin Laba-Laba",
  giant_spider:"Laba-Laba Raksasa", volcano_drakling:"Naga Kecil Gunung Berapi", volcano_drake_boss:"Naga Rawa Beracun",
  jy_goblin:"Goblin Pemulung", jy_tinyboxer:"Petinju Kecil", jy_boxer:"Petinju Besi", jy_skeleton:"Tengkorak Rongsokan",
  jy_brute:"Bruto Rongsokan", jy_golem:"Golem Rongsokan", jy_goliath:"Goliath Rongsokan",
  jy_buffed_titan:"Titan Rongsokan", clockwork_imp:"Iblis Mesin", clockwork_soldier:"Prajurit Mesin",
  clockwork_behemoth:"Behemoth Mesin", dust_elemental_boss:"Elemental Debu Agung", jy_titan:"Kesatria Baja Terkutuk",
  frost_yetling:"Yeti Kecil Es", frost_ice_buff:"Naga Es Abadi",
  abyss_druid:"Druid Jurang", abyss_fat_gargoyle:"Gargoyle Gemuk", abyss_goblin:"Goblin Jurang",
  abyss_imp:"Iblis Jurang", abyss_lurker:"Penyelinap Jurang", abyss_minion:"Antek Jurang",
  abyss_monster:"Monster Jurang", abyss_slug:"Siput Jurang", abyss_squid:"Cumi Jurang",
  abyss_tiny_slug:"Siput Kecil Jurang", volcano_imp:"Iblis Gunung Berapi", fire_imp:"Iblis Api",
  fire_elemental:"Elemental Api", abyss_reaper:"Iblis Penjaga Jurang", abyss_siren3:"Penguasa Kegelapan",
};
function makeMonster(dungeonId, subFloor, isBoss, forcedSpriteKey){
  const d = DUNGEONS.find(x=>x.id===dungeonId);
  const diff = difficultyValue(dungeonId, subFloor);
  const baseHp = 25 * Math.pow(diff, 1.32);
  const baseAtk = 4 * Math.pow(diff, 1.18);
  const baseDef = 2 * Math.pow(diff, 1.05);
  const mult = isBoss ? 6 : 1;
  const spriteKey = forcedSpriteKey || pickMonsterSprite(dungeonId, isBoss);
  return {
    name: isBoss ? d.boss : (MONSTER_SPRITE_NAMES[spriteKey] || d.monsterName),
    spriteKey,
    isBoss,
    dungeonId, subFloor, diff,
    element: d.element,
    hp: Math.round(baseHp*mult),
    maxHp: Math.round(baseHp*mult),
    atk: Math.round(baseAtk*(isBoss?2.2:1)),
    def: Math.round(baseDef*(isBoss?1.6:1)),
    dialogueIndex: 0,
  };
}

/* ============================== SKILL / LEVEL LOGIC ============================== */

function tryLearnSkill(id){
  if(!player.skills.includes(id)){
    player.skills.push(id);
    return getSkill(id);
  }
  return null;
}
function onMonsterKilled(monster){
  const learned = [];
  if(monster.isBoss){
    const uniqPool = SKILLS.filter(s=>s.source==="boss" && !player.skills.includes(s.id));
    if(uniqPool.length){
      const pick = uniqPool[Math.floor(Math.random()*uniqPool.length)];
      const l = tryLearnSkill(pick.id);
      if(l) learned.push(l);
    }
  }
  return learned;
}
function grantXp(amount){
  player.xp += amount;
  const leveled = [];
  while(player.xp >= xpForLevel(player.level)){
    player.xp -= xpForLevel(player.level);
    player.level++;
    player.skillPoints += 1;
    player.baseAtk += 1;
    if(player.level%2===0) player.baseDef += 1;
    leveled.push(player.level);
  }
  if(leveled.length){
    player.maxHp = computeMaxHp();
    player.hp = player.maxHp;
  }
  return leveled;
}

/* ============================== KRISTAL DROP ============================== */

function rollCrystalDrop(monster){
  const f = monster.diff;
  const r = Math.random();
  let key = "biasa";
  const bossBonus = monster.isBoss ? 0.25 : 0;
  const p = r - bossBonus - f*0.01;
  if(p < 0.015) key = "dewa";
  else if(p < 0.05) key = "legendaris";
  else if(p < 0.16) key = "mistis";
  else if(p < 0.42) key = "epik";
  else if(p < 0.75) key = "langka";
  else key = "biasa";
  const qty = monster.isBoss ? (1+Math.floor(Math.random()*3)) : 1;
  player.crystals[key] += qty;
  return {key, qty};
}

/* ============================== BATTLE STATE ============================== */

let battle = null;
let battleSpriteRAF = null;
function startBattle(monster){
  battle = {
    monster,
    log: [`${monster.name} muncul di hadapanmu!`],
    playerBuffs: { atk:0, def:0, turnsLeft:0, dodgeBoost:0, dodgeTurns:0 },
    skillCooldowns: {},
    ended:false,
    talked: false,
  };
  playerAtkAnim = null;
  enemyShake = null; playerShake = null;
  floatingTexts = [];
  showScreen("screen-battle");
  renderBattle();
  runEnemySpriteLoop();
}
function runEnemySpriteLoop(){
  if(battleSpriteRAF) cancelAnimationFrame(battleSpriteRAF);
  const canvas = document.getElementById("enemy-sprite-canvas");
  const ctx = canvas.getContext("2d");
  const pcanvas = document.getElementById("player-sprite-canvas");
  const pctx = pcanvas.getContext("2d");
  function loop(){
    if(document.getElementById("screen-battle").style.display==="none" || !battle){ return; }
    // ---- sisi musuh ----
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    const eShakeOff = shakeOffset(enemyShake);
    ctx.translate(eShakeOff.x, eShakeOff.y);
    const size = battle.monster.isBoss ? 120 : 90;
    drawMonsterSprite(ctx, battle.monster.spriteKey, canvas.width/2, canvas.height/2+size/2-10, size, true);
    drawActiveSkillEffect(ctx, canvas);
    ctx.restore();
    drawFloatingTexts(ctx, canvas, "enemy");
    // ---- sisi pemain ----
    pctx.clearRect(0,0,pcanvas.width,pcanvas.height);
    pctx.save();
    const pShakeOff = shakeOffset(playerShake);
    pctx.translate(pShakeOff.x, pShakeOff.y);
    drawPlayerAttackSprite(pctx, pcanvas);
    pctx.restore();
    drawFloatingTexts(pctx, pcanvas, "player");
    battleSpriteRAF = requestAnimationFrame(loop);
  }
  loop();
}

/* ---------- SPRITE SERANGAN PEMAIN (per jenis senjata) ---------- */
const PLAYER_ATK_SHEETS = {
  "Pedang":        { src:"assets/atk_pedang.png",  frames:4, w:320, h:230 },
  "Kapak":         { src:"assets/atk_kapak.png",   frames:3, w:260, h:230 },
  "Busur":         { src:"assets/atk_busur.png",   frames:5, w:300, h:200 },
  "Tongkat Sihir": { src:"assets/atk_tongkat.png", frames:4, w:320, h:230 },
};
const playerAtkSheetCache = {};
Object.entries(PLAYER_ATK_SHEETS).forEach(([key,cfg])=>{
  const img = new Image();
  const rec = { img, loaded:false, frames:cfg.frames, w:cfg.w, h:cfg.h };
  img.onload = ()=>{ rec.loaded = true; };
  img.src = cfg.src;
  playerAtkSheetCache[key] = rec;
});
function currentWeaponTypeName(){
  const w = getWeapon(player.equipped.weapon);
  if(!w) return "Pedang";
  const t = WEAPON_TYPES.find(t=> w.name.endsWith(t.name));
  // Tombak/Belati/Palu Perang belum punya sprite sendiri -> pakai Pedang sbg gaya default
  return (t && playerAtkSheetCache[t.name]) ? t.name : "Pedang";
}
let playerAtkAnim = null; // {start, duration}
function triggerPlayerAttackAnim(){
  playerAtkAnim = { start: Date.now(), duration: 480 };
  const wtype = currentWeaponTypeName();
  if(wtype === "Busur"){
    // Busur: karakter & busurnya diam di tempat, cuma anak panahnya yg melesat ke monster lalu hilang
    fireProjectile("arrow-projectile");
    return;
  }
  if(wtype === "Tongkat Sihir"){
    // Tongkat Sihir: karakter diam di tempat, cuma bola sihirnya yg melesat ke monster lalu hilang
    fireProjectile("magic-projectile");
    return;
  }
  // FITUR: karakter menerjang maju ke arah monster lalu kembali ke tempat semula, disinkron dgn animasi
  const canvas = document.getElementById("player-sprite-canvas");
  if(canvas){
    canvas.classList.remove("lunge");
    void canvas.offsetWidth; // paksa reflow biar animasi bisa diulang kalau ke-trigger cepat berturut-turut
    canvas.classList.add("lunge");
    setTimeout(()=>{ canvas.classList.remove("lunge"); }, playerAtkAnim.duration+40);
  }
}
function fireProjectile(elId){
  const arena = document.querySelector(".battle-arena");
  const proj = document.getElementById(elId);
  const playerCanvas = document.getElementById("player-sprite-canvas");
  const enemyCanvas = document.getElementById("enemy-sprite-canvas");
  if(!arena || !proj || !playerCanvas || !enemyCanvas) return;
  const arenaRect = arena.getBoundingClientRect();
  const pRect = playerCanvas.getBoundingClientRect();
  const eRect = enemyCanvas.getBoundingClientRect();
  const startX = pRect.left + pRect.width*0.65 - arenaRect.left;
  const startY = pRect.top + pRect.height*0.42 - arenaRect.top;
  const endX = eRect.left + eRect.width*0.4 - arenaRect.left;
  const endY = eRect.top + eRect.height*0.42 - arenaRect.top;
  proj.style.transition = "none";
  proj.style.left = `${startX}px`;
  proj.style.top = `${startY}px`;
  proj.style.opacity = "1";
  proj.style.display = "block";
  void proj.offsetWidth; // paksa reflow
  proj.style.transition = "left 0.3s linear, top 0.3s linear";
  requestAnimationFrame(()=>{
    proj.style.left = `${endX}px`;
    proj.style.top = `${endY}px`;
  });
  // FITUR: proyektil tidak kembali ke tempat semula — langsung hilang begitu "kena" monster
  setTimeout(()=>{ proj.style.display = "none"; }, 320);
}
function drawPlayerAttackSprite(ctx, canvas){
  const sheet = playerAtkSheetCache[currentWeaponTypeName()] || playerAtkSheetCache["Pedang"];
  let frame = 0;
  if(playerAtkAnim){
    const t = Date.now()-playerAtkAnim.start;
    if(t >= playerAtkAnim.duration){ playerAtkAnim = null; frame = 0; }
    else frame = Math.min(sheet.frames-1, Math.floor((t/playerAtkAnim.duration)*sheet.frames));
  }
  if(!sheet.loaded){
    ctx.font="46px serif"; ctx.textAlign="center";
    ctx.fillText("🧑", canvas.width/2, canvas.height/2+20);
    return;
  }
  const sx = frame*sheet.w;
  const scale = (canvas.height/sheet.h)*1.05;
  const dw = sheet.w*scale, dh = sheet.h*scale;
  ctx.drawImage(sheet.img, sx, 0, sheet.w, sheet.h,
    canvas.width/2-dw*0.32, canvas.height-dh, dw, dh);
}

/* ---------- EFEK GETAR & TEKS DAMAGE MELAYANG ---------- */
let enemyShake = null, playerShake = null;
function triggerShake(target){ // target: "enemy" | "player"
  const state = { start: Date.now(), duration: 320 };
  if(target==="enemy") enemyShake = state; else playerShake = state;
}
function shakeOffset(state){
  if(!state) return {x:0,y:0};
  const t = Date.now()-state.start;
  if(t > state.duration) return {x:0,y:0};
  const decay = 1-(t/state.duration);
  const mag = 6*decay;
  return { x: Math.sin(t*0.09)*mag, y: Math.cos(t*0.13)*mag*0.5 };
}
let floatingTexts = [];
function spawnFloatingText(target, text, color){ // target: "enemy" | "player"
  floatingTexts.push({ target, text, color: color||"#ffffff", start: Date.now(), duration: 900 });
}
function drawFloatingTexts(ctx, canvas, target){
  const now = Date.now();
  floatingTexts = floatingTexts.filter(f=> now-f.start <= f.duration);
  floatingTexts.filter(f=>f.target===target).forEach(f=>{
    const t = (now-f.start)/f.duration;
    const y = canvas.height*0.32 - t*34;
    const alpha = 1-t;
    ctx.save();
    ctx.globalAlpha = Math.max(0,alpha);
    ctx.font = "bold 20px sans-serif"; ctx.textAlign = "center";
    ctx.lineWidth = 3; ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.strokeText(f.text, canvas.width/2, y);
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, canvas.width/2, y);
    ctx.restore();
  });
}

// ---------- EFEK VISUAL SKILL (spritesheet 6-frame dari 99_efek_skill_pixel) ----------
const SKILL_EFFECT_CACHE = {};
function ensureSkillEffectLoaded(skill){
  if(!skill || !skill.effectFile) return null;
  if(!SKILL_EFFECT_CACHE[skill.id]){
    const img = new Image();
    const rec = { img, loaded:false };
    img.onload = ()=>{ rec.loaded = true; };
    img.src = skill.effectFile;
    SKILL_EFFECT_CACHE[skill.id] = rec;
  }
  return SKILL_EFFECT_CACHE[skill.id];
}
let activeSkillEffect = null;
function playSkillEffect(skill){
  const rec = ensureSkillEffectLoaded(skill);
  if(!rec) return;
  activeSkillEffect = { rec, start: Date.now(), duration: 750 };
}
function drawActiveSkillEffect(ctx, canvas){
  if(!activeSkillEffect) return;
  const { rec, start, duration } = activeSkillEffect;
  const t = Date.now()-start;
  if(t > duration){ activeSkillEffect = null; return; }
  if(!rec.loaded) return;
  const frame = Math.min(5, Math.floor((t/duration)*6));
  const size = 128;
  ctx.drawImage(rec.img, frame*size, 0, size, size, canvas.width/2-size/2, canvas.height/2-size/2, size, size);
}
function battleLog(msg){
  battle.log.push(msg);
  if(battle.log.length>6) battle.log.shift();
  const el = document.getElementById("battle-log");
  if(el) el.innerHTML = battle.log.map(l=>`<div>${l}</div>`).join("");
}
function currentPlayerAtk(){ return playerTotalAtk() + battle.playerBuffs.atk; }
function currentPlayerDef(){ return playerTotalDef() + battle.playerBuffs.def; }
function tickBuffs(){
  const b = battle.playerBuffs;
  if(b.turnsLeft>0){ b.turnsLeft--; if(b.turnsLeft===0){ b.atk=0; b.def=0; } }
  if(b.dodgeTurns>0){ b.dodgeTurns--; if(b.dodgeTurns===0) b.dodgeBoost=0; }
  Object.keys(battle.skillCooldowns).forEach(k=>{ if(battle.skillCooldowns[k]>0) battle.skillCooldowns[k]--; });
}

/* ---------- TIMING BAR (serangan ala Undertale) ---------- */
// Zona kuning (::before di CSS: 42%-58%) = KRITIS. Sisanya (hitam) = normal.
const CRIT_ZONE_HALFWIDTH = 8; // 50 +/- 8 => 42-58, cocok dgn CSS
let timingBarState = null;
function startTimingBar(onResult){
  timingBarState = { pos:0, dir:1, running:true, onResult };
  const track = document.getElementById("timing-track");
  const marker = document.getElementById("timing-marker");
  const legend = document.getElementById("timing-legend");
  const confirmBtn = document.getElementById("timing-confirm-btn");
  track.style.display = "block";
  if(legend) legend.style.display = "block";
  if(confirmBtn) confirmBtn.style.display = "block"; // FIX BUG: ini tombol yg tadinya tidak ada utk mengunci serangan
  timingBarState.raf = setInterval(()=>{
    timingBarState.pos += timingBarState.dir*4;
    if(timingBarState.pos>=100){ timingBarState.pos=100; timingBarState.dir=-1; }
    if(timingBarState.pos<=0){ timingBarState.pos=0; timingBarState.dir=1; }
    marker.style.left = timingBarState.pos+"%";
  }, 16);
  // jaring pengaman: kalau pemain tidak menekan sama sekali, tetap otomatis "mengunci" setelah 6 detik
  timingBarState.autoTimeout = setTimeout(()=>{ if(timingBarState && timingBarState.running) stopTimingBar(); }, 6000);
}
function stopTimingBar(){
  if(!timingBarState || !timingBarState.running) return;
  timingBarState.running = false;
  clearInterval(timingBarState.raf);
  clearTimeout(timingBarState.autoTimeout);
  document.getElementById("timing-track").style.display = "none";
  const legend = document.getElementById("timing-legend");
  if(legend) legend.style.display = "none";
  const confirmBtn = document.getElementById("timing-confirm-btn");
  if(confirmBtn) confirmBtn.style.display = "none";
  const dist = Math.abs(50 - timingBarState.pos);
  let power;
  if(dist<5) power = 1.8;
  else if(dist<15) power = 1.4;
  else if(dist<30) power = 1.0;
  else power = 0.6;
  const zoneCrit = dist <= CRIT_ZONE_HALFWIDTH;
  const cb = timingBarState.onResult;
  timingBarState = null;
  cb(power, zoneCrit);
}

/* ---------- AKSI PEMAIN ---------- */
function playerAttack(){
  if(battle.ended) return;
  document.getElementById("battle-actions").style.display="none";
  startTimingBar((power, zoneCrit)=>{
    triggerPlayerAttackAnim();
    const crit = zoneCrit || (Math.random()*100 < playerTotalCrit());
    let dmg = mitigatedDamage(currentPlayerAtk()*power, battle.monster.def||0);
    if(crit) dmg = Math.round(dmg*1.8);
    battle.monster.hp -= dmg;
    setTimeout(()=>{
      triggerShake("enemy");
      spawnFloatingText("enemy", `-${dmg}`, crit?"#ffd23f":"#ff5c7a");
    }, 220);
    const powerLabel = power>=1.6?"SEMPURNA!":power>=1.2?"Bagus!":power>=0.9?"Kena":"Meleset";
    battleLog(`Kamu menyerang! ${dmg} damage${crit?" 💥 KRITIS!":""}. (${powerLabel})`);
    afterPlayerAction();
  });
}
function playerUseSkill(skillId){
  const s = getSkill(skillId);
  if(!s || s.type!=="attack") return;
  if(battle.skillCooldowns[skillId]>0){ battleLog(`${s.name} masih cooldown ${battle.skillCooldowns[skillId]} giliran.`); return; }
  closeSkillMenu();
  document.getElementById("battle-actions").style.display="none";
  startTimingBar((power, zoneCrit)=>{
    triggerPlayerAttackAnim();
    playSkillEffect(s);
    const crit = zoneCrit || (Math.random()*100 < playerTotalCrit());
    let dmg = mitigatedDamage(currentPlayerAtk()*s.mult*power*0.6, battle.monster.def||0);
    if(crit) dmg = Math.round(dmg*1.8);
    battle.monster.hp -= dmg;
    setTimeout(()=>{
      triggerShake("enemy");
      spawnFloatingText("enemy", `-${dmg}`, crit?"#ffd23f":"#ff5c7a");
    }, 220);
    battle.skillCooldowns[skillId] = s.cd;
    battleLog(`Kamu memakai ${s.name}! ${dmg} damage elemen ${s.element}${crit?" 💥 KRITIS!":""}.`);
    afterPlayerAction();
  });
}
function playerUseItem(potionId){
  const owned = player.inventory.potions[potionId]||0;
  if(owned<=0) return;
  const p = getPotion(potionId);
  closeItemMenu();
  player.inventory.potions[potionId]--;
  if(p.effect==="heal"){ player.hp = Math.min(player.maxHp, player.hp+p.value); battleLog(`Kamu minum ${p.name}. HP +${p.value}.`); }
  else if(p.effect==="healfull"){ player.hp = player.maxHp; battleLog(`Kamu minum ${p.name}. HP pulih penuh!`); }
  else if(p.effect==="buffAtk"){ battle.playerBuffs.atk+=p.value; battle.playerBuffs.turnsLeft=Math.max(battle.playerBuffs.turnsLeft,p.duration); battleLog(`Serangan meningkat +${p.value}!`); }
  else if(p.effect==="buffDef"){ battle.playerBuffs.def+=p.value; battle.playerBuffs.turnsLeft=Math.max(battle.playerBuffs.turnsLeft,p.duration); battleLog(`Pertahanan meningkat +${p.value}!`); }
  else if(p.effect==="buffAll"){ battle.playerBuffs.atk+=p.value; battle.playerBuffs.def+=Math.round(p.value/2); battle.playerBuffs.turnsLeft=Math.max(battle.playerBuffs.turnsLeft,p.duration); battleLog(`Seluruh kemampuan meningkat!`); }
  else if(p.effect==="dodgeBoost"){ battle.playerBuffs.dodgeBoost+=p.value; battle.playerBuffs.dodgeTurns=Math.max(battle.playerBuffs.dodgeTurns,p.duration); battleLog(`Kelincahanmu meningkat!`); }
  else { battleLog(`Kamu memakai ${p.name}.`); }
  afterPlayerAction();
}
function playerDefend(){
  document.getElementById("battle-actions").style.display="none";
  battle.playerBuffs.def += Math.round(playerTotalDef()*0.5)+3;
  battle.playerBuffs.turnsLeft = Math.max(battle.playerBuffs.turnsLeft,1);
  battleLog("Kamu bersiap bertahan!");
  afterPlayerAction();
}
function playerRun(){
  if(battle.monster.isBoss){ battleLog("Tidak bisa kabur dari Bos!"); return; }
  battleLog("Kamu berhasil kabur!");
  battle.ended = true;
  setTimeout(()=>{ endBattle(false); }, 700);
}
function afterPlayerAction(){
  renderBattle();
  if(battle.monster.hp<=0){
    setTimeout(()=>onMonsterDefeated(), 500);
    return;
  }
  setTimeout(()=> monsterTurn(), 700);
}

/* ---------- GILIRAN MONSTER: DODGE MINIGAME ---------- */
function monsterTurn(){
  tickBuffs();
  if(battle.monster.isBoss){
    const lines = BOSS_DIALOGUE[battle.monster.name];
    if(lines && battle.monster.dialogueIndex < lines.length && Math.random()<0.6){
      battleLog(`💬 ${battle.monster.name}: "${lines[battle.monster.dialogueIndex]}"`);
      battle.monster.dialogueIndex++;
    }
  }
  startDodgePhase();
}

// Efek visual peluru serangan monster di minigame menghindar — dipilih sesuai tema tiap dungeon
const DUNGEON_BULLET_POOL = {
  1: ["05_jatuhnya_daun.png","08_bunga_terbang.png","37_bulu_terbang.png","20_cacahan_batu.png","10_biji_bijian_terbang.png"],
  2: ["19_lingkaran_darah.png","09_gumpalan_asap.png","22_bayangan_hitam.png","06_awan_gelap_hujan.png","21_gelombang_suara.png"],
  3: ["46_lingkaran_kegelapan.png","44_efek_teleportasi.png","34_jejak_kaki.png","38_petak_petak_cahaya.png","47_petunjuk_cahaya.png"],
  4: ["12_cincin_cahaya.png","16_bola_energi.png","03_bintang_berkilau.png","27_lingkaran_magnet.png","48_serpihan_bintang.png"],
  5: ["13_tetesan_air.png","45_gelombang_air.png","24_pecahan_kaca.png","35_lingkaran_debu.png","39_lingkaran_melingkar.png"],
  6: ["40_bola_api.png","02_api_api_kecil.png","25_gumpalan_lava.png","33_uap_panas.png","14_kembang_api_kecil.png"],
  7: ["15_garis_garis_listrik.png","04_petir_kecil.png","41_rantai_energi.png","28_efek_distorsi.png","50_efek_kecepatan.png"],
  8: ["11_serpihan_es.png","31_kepingan_salju.png","18_badai_salju.png","36_cahaya_bulan.png","01_bulatan_kecil_berwarna.png"],
  9: ["23_peluru_kecil.png","29_bunga_api.png","26_serpihan_kertas.png","32_koin_berputar.png","17_kilatan_cahaya.png"],
  10:["49_lingkaran_waktu.png","42_jari_jari_cahaya.png","30_lingkaran_pelangi.png","43_jejak_pelangi.png","07_lingkaran_angin.png"],
};
function pickBulletSprite(dungeonId){
  const pool = DUNGEON_BULLET_POOL[dungeonId] || DUNGEON_BULLET_POOL[1];
  return "assets/bullet_effects/" + pool[Math.floor(Math.random()*pool.length)];
}

let dodgeGame = null;
function startDodgePhase(){
  const box = document.getElementById("dodge-box");
  box.style.display = "block";
  dodgeVec.x = 0; dodgeVec.y = 0;
  const knob = document.getElementById("dodge-knob");
  if(knob) knob.style.transform = "translate(-50%,-50%)";
  document.getElementById("battle-actions").style.display="none";
  const w = box.clientWidth, h = box.clientHeight;
  const diff = battle.monster.diff||1;
  const durationMs = 5000 + Math.min(5000, diff*500); // 5-10 detik, makin sulit makin lama
  dodgeGame = {
    player:{x:w/2, y:h-30, w:16, h:16},
    bullets:[],
    ticks: 0,
    maxTicks: Math.round(durationMs/33),
    hit:false,
    speed: Math.min(9, 1.6+diff*0.55),
    spawnEvery: Math.max(5, 20-Math.round(diff*1.3)),
    bulletCountCap: Math.min(10, 2+Math.floor(diff/1.2)),
    keys:{left:false,right:false,up:false,down:false},
    facing:"down", moving:false,
  };
  renderDodgePlayer();
  dodgeGame.interval = setInterval(dodgeTick, 33);
}
function dodgeTick(){
  const box = document.getElementById("dodge-box");
  const w = box.clientWidth, h = box.clientHeight;
  const g = dodgeGame;
  g.ticks++;
  const spd = 5;
  // FITUR: gabungkan input panah keyboard (digital, kekuatan penuh per sumbu) dgn analog stick
  // (bisa miring/segala arah) — hasilnya dinormalisasi biar diagonal gak lebih cepat dari lurus.
  let mx = (g.keys.right?1:0) - (g.keys.left?1:0) + dodgeVec.x;
  let my = (g.keys.down?1:0) - (g.keys.up?1:0) + dodgeVec.y;
  const mlen = Math.sqrt(mx*mx+my*my);
  if(mlen > 1){ mx/=mlen; my/=mlen; }
  g.moving = mlen > 0.15;
  if(g.moving){
    g.facing = Math.abs(mx) > Math.abs(my) ? (mx>0?"right":"left") : (my>0?"down":"up");
  }
  g.player.x += mx*spd;
  g.player.y += my*spd;
  g.player.x = Math.max(8, Math.min(w-8, g.player.x));
  g.player.y = Math.max(8, Math.min(h-8, g.player.y));

  if(g.ticks % g.spawnEvery === 0 && g.ticks < g.maxTicks-20){
    const count = 1 + Math.floor(Math.random()*Math.min(3, g.bulletCountCap));
    for(let i=0;i<count;i++){
      g.bullets.push({
        x: Math.random()*w, y: -10,
        vy: g.speed*(0.8+Math.random()*0.5), vx:(Math.random()-0.5)*1.5,
        sprite: pickBulletSprite(battle.monster.dungeonId),
        rot: Math.round(Math.random()*360),
      });
    }
  }
  g.bullets.forEach(b=>{ b.x+=b.vx; b.y+=b.vy; });
  g.bullets = g.bullets.filter(b=> b.y < h+20);

  const dodgeReduction = Math.min(0.35, (battle.playerBuffs.dodgeBoost)/150);
  for(const b of g.bullets){
    const dx = b.x-g.player.x, dy=b.y-g.player.y;
    if(Math.sqrt(dx*dx+dy*dy) < 15){
      if(Math.random() < dodgeReduction) continue; // potion kecepatan bisa bikin lolos sesekali
      g.hit = true;
      b.y = h+999;
    }
  }
  renderDodgePlayer();
  if(g.ticks >= g.maxTicks){
    endDodgePhase();
  }
}
function renderDodgePlayer(){
  const box = document.getElementById("dodge-box");
  const dw = 26, dh = 36;
  const sheet = (WALK_SHEETS[dodgeGame.facing] || WALK_SHEETS.down).src;
  const frame = dodgeGame.moving ? Math.floor(Date.now()/90)%WALK_FRAME_COUNT : 0;
  const heroStyle = `left:${dodgeGame.player.x-dw/2}px; top:${dodgeGame.player.y-dh*0.85}px; width:${dw}px; height:${dh}px;`
    + `background-image:url('${sheet}'); background-size:${dw*WALK_FRAME_COUNT}px ${dh}px; background-position:-${frame*dw}px 0px;`;
  let html = `<div class="dodge-hero" style="${heroStyle}"></div>`;
  dodgeGame.bullets.forEach(b=>{
    html += `<div class="dodge-bullet" style="left:${b.x-14}px; top:${b.y-14}px; background-image:url('${b.sprite}'); transform:rotate(${b.rot}deg);"></div>`;
  });
  box.innerHTML = html;
}
function endDodgePhase(){
  clearInterval(dodgeGame.interval);
  document.getElementById("dodge-box").style.display="none";
  document.getElementById("dodge-box").innerHTML="";
  if(dodgeGame.hit){
    const dmg = mitigatedDamage(battle.monster.atk, currentPlayerDef());
    player.hp -= dmg;
    triggerShake("player");
    spawnFloatingText("player", `-${dmg}`, "#ff5c7a");
    battleLog(`💥 Kamu terkena serangan ${battle.monster.name}! -${dmg} HP.`);
  } else {
    battleLog(`✅ Kamu berhasil menghindar semua serangan!`);
  }
  dodgeGame = null;
  renderBattle();
  if(player.hp<=0){ setTimeout(()=>onPlayerDefeated(),500); return; }
  document.getElementById("battle-actions").style.display="flex";
}

/* ---------- AKHIR PERTARUNGAN ---------- */
function onMonsterDefeated(){
  const wasBoss = battle.monster.isBoss;
  const dungeonId = battle.monster.dungeonId;
  const subFloor = battle.monster.subFloor;
  const totalFloors = dungeonFloors(dungeonId);
  battleLog(`${battle.monster.name} dikalahkan!`);
  const drop = rollCrystalDrop(battle.monster);
  battleLog(`Kamu mendapat ${drop.qty}x ${CRYSTAL_TYPES.find(c=>c.key===drop.key).name}!`);
  const xpGain = Math.round((wasBoss?9:1) * (10 + battle.monster.diff*4));
  const leveled = grantXp(xpGain);
  battleLog(`+${xpGain} XP`);
  leveled.forEach(lv=> battleLog(`🌟 Naik ke Level ${lv}! (+1 Poin Skill)`));
  const learned = onMonsterKilled(battle.monster);
  learned.forEach(s=> battleLog(`🎉 Skill baru didapat: ${s.name}!`));
  battle.ended = true;
  const isLastFloor = (dungeonId===10) || (subFloor>=totalFloors);
  if(!wasBoss){
    const key = dungeonId+"_"+subFloor;
    player.floorProgress[key] = (player.floorProgress[key]||0)+1;
    // FIX BUG: sebelumnya tangga cuma dimunculkan saat enterDungeon() dipanggil (yaitu waktu
    // MASUK lantai), jadi kalau musuh terakhir dikalahkan SAAT SEDANG di lantai itu, tangganya
    // gak pernah muncul sampai keluar-masuk lagi. Sekarang dicek & dimunculkan langsung di sini.
    if(!isLastFloor){
      const need = monstersPerSubfloor(dungeonId);
      const killedNow = player.floorProgress[key];
      const stairsAlready = dungeonMonsters.some(m=>m.isStairs);
      if(killedNow>=need && !stairsAlready){
        dungeonMonsters.push({ x:640, y:220, alive:true, isStairs:true, uid:"stairs" });
      }
    }
  } else {
    if(dungeonId===10){
      battleLog("🏆 SELAMAT! Kamu mengalahkan Penguasa Kegelapan dan menamatkan TERRASH-WORLD!");
      player.dungeonCleared[10] = true;
    } else if(isLastFloor){
      battleLog(`Dungeon ${DUNGEONS.find(x=>x.id===dungeonId).name} berhasil ditaklukkan! Dungeon berikutnya kini terbuka.`);
      player.dungeonCleared[dungeonId] = true;
      player.maxFloorReached = Math.max(player.maxFloorReached, dungeonId+1);
    }
  }
  persist();
  setTimeout(()=>{ endBattle(true); }, 1400);
}
function onPlayerDefeated(){
  battleLog("Kamu tumbang... semua kristal yang kau bawa hilang!");
  player.crystals = { biasa:0, langka:0, epik:0, mistis:0, legendaris:0, dewa:0 };
  player.hp = player.maxHp;
  player.currentFloor = 0;
  persist();
  battle.ended = true;
  setTimeout(()=>{ endBattle(true); goToLobby(); }, 1600);
}
function endBattle(removeMonster){
  const monster = battle.monster;
  battle = null;
  document.getElementById("battle-actions").style.display="flex";
  document.getElementById("timing-track").style.display="none";
  const confirmBtn = document.getElementById("timing-confirm-btn"); if(confirmBtn) confirmBtn.style.display="none";
  dungeonReentryGrace = Date.now() + 3000; // jeda ~3 detik biar gak langsung ke-trigger fight lain begitu kembali
  if(player.currentFloor===0){ showScreen("screen-overworld"); renderOverworld(); }
  else { showScreen("screen-dungeon"); if(removeMonster) removeCurrentMonsterSprite(monster); renderDungeon(); }
}

/* ============================== NAVIGASI LAYAR ============================== */
function showScreen(id){
  // FIX BUG UTAMA: sebelumnya di sini dipaksa style.display="block" lewat JS untuk SEMUA layar,
  // padahal #screen-battle & #screen-login butuh "flex" (dari CSS) supaya tombol aksi, timing-bar,
  // dan layout landscape-nya tersusun benar. Inline style JS selalu menang atas CSS manapun,
  // jadi CSS flex-nya nggak pernah kepakai sama sekali. Sekarang cukup hapus inline "none"-nya,
  // biar aturan CSS asli tiap #id (flex/block) yang berlaku.
  document.querySelectorAll(".screen").forEach(s=> s.style.display="none");
  document.getElementById(id).style.removeProperty("display");
}

/* ============================== OVERWORLD (LOBBY GUILD) — dgn dinding & pintu presisi dari collision data ============================== */
const lobbyBg = new Image();
let lobbyBgLoaded = false;
lobbyBg.onload = ()=>{ lobbyBgLoaded = true; };
lobbyBg.src = "assets/lobby_bg.jpg";

// Data dikalibrasi presisi dari collision_rectangles.json (koordinat asli 1672x941, di-skala ke kanvas 700x467)
// Tiap bangunan: `blocks` = kotak2 solid (dinding tak terlihat), `door` = celah/area pintu masuk,
// `sprite/sx/sy/dw/dh` = potongan gambar bangunan yg digambar ULANG di atas pemain tiap frame,
// supaya bangunan terlihat "menembus" pemain (pemain kelihatan masuk ke balik pintu), bukan sebaliknya.
const LOBBY_BUILDINGS = [
  { name:"Balai Guild", sprite:"assets/lobby_buildings/01_Balai_Guild_Jual_Kristal_jadi_Coin.png", sx:288.9, sy:0.5, dw:102.6, dh:141.4, blocks:[[296.1,25.3,384.3,98.7],[296.1,104.7,321.5,133.5],[358.9,104.7,384.3,133.5]], action:"guild", door:[322.5,99.7,357.9,138.5] },
  { name:"Toko Senjata & Armor", sprite:"assets/lobby_buildings/02_Toko_Senjata_dan_Armor.png", sx:131.9, sy:21.8, dw:146.5, dh:119.1, blocks:[[139.1,30.3,271.2,98.7],[139.1,104.7,168.7,133.5],[239.5,104.7,271.2,133.5]], action:"shop", door:[169.7,99.7,238.5,138.5] },
  { name:"Merchant Ramuan", sprite:"assets/lobby_buildings/03_Merchant_Ramuan_Beli_Potion.png", sx:414.5, sy:22.8, dw:104.7, dh:119.1, blocks:[[421.7,30.3,512.0,98.7],[421.7,104.7,445.0,133.5],[488.6,104.7,512.0,133.5]], action:"merchant", door:[446.0,99.7,487.6,138.5] },
  { name:"Gerbang Dungeon", sprite:"assets/lobby_buildings/04_Gerbang_Dungeon_Pilih_Lantai.png", sx:550.5, sy:22.3, dw:115.1, dh:121.6, blocks:[[555.6,30.3,658.5,133.5]], action:"dungeon_select", door:[583.3,133.6,630.8,140.5] },
  { name:"Penginapan", sprite:"assets/lobby_buildings/05_Penginapan_Reset.png", sx:52.3, sy:136.5, dw:142.3, dh:94.3, blocks:[[59.5,144.4,187.5,188.1],[59.5,194.1,89.1,220.3],[157.9,194.1,187.5,220.3]], action:"inn", door:[90.1,189.1,156.9,225.3] },
  { name:"Bank", sprite:"assets/lobby_buildings/06_Bank.png", sx:418.7, sy:134.5, dw:102.6, dh:96.8, blocks:[[425.8,142.0,514.0,188.1],[425.8,194.1,449.2,222.8],[488.6,194.1,514.0,222.8]], action:"bank", door:[450.2,189.1,487.6,227.8] },
  { name:"Tukang Besi", sprite:"assets/lobby_buildings/07_Tukang_Besi_Upgrade.png", sx:531.7, sy:134.5, dw:115.1, dh:99.3, blocks:[[538.9,142.0,639.6,190.5],[538.9,196.5,566.4,225.3],[614.2,196.5,639.6,225.3]], action:"blacksmith", door:[567.4,191.5,613.2,230.3] },
  { name:"Rumah Penduduk Kiri", sprite:"assets/lobby_buildings/08_Rumah_Penduduk_Kiri.png", sx:44.0, sy:220.3, dw:125.6, dh:96.8, blocks:[[51.1,228.8,162.4,272.4],[51.1,278.4,78.6,309.7],[134.9,278.4,162.4,309.7]], action:null, door:[79.6,273.4,133.9,314.7] },
  { name:"Papan Misi", sprite:"assets/lobby_buildings/09_Papan_Misi_Quest.png", sx:211.4, sy:230.8, dw:96.3, dh:89.3, blocks:[[218.6,241.2,300.5,299.7]], action:"questboard", door:[240.0,300.7,279.2,316.6] },
  { name:"Pasar", sprite:"assets/lobby_buildings/10_Pasar_Beli_dan_Jual.png", sx:399.8, sy:230.8, dw:100.5, dh:91.8, blocks:[[407.0,241.2,493.1,302.2]], action:"market", door:[429.6,303.2,470.5,319.1] },
  { name:"Rumah Penduduk Kanan", sprite:"assets/lobby_buildings/11_Rumah_Penduduk_Kanan.png", sx:519.1, sy:220.3, dw:142.3, dh:99.3, blocks:[[526.3,228.8,654.3,272.4],[526.3,278.4,555.9,312.1],[624.7,278.4,654.3,312.1]], action:null, door:[556.9,273.4,623.7,317.1] },
  { name:"Air Mancur", sprite:"assets/lobby_buildings/Air_Mancur_Pusat.png", sx:295.2, sy:121.1, dw:104.7, dh:109.2, blocks:[[310.7,139.5,384.3,153.3],[304.4,159.3,315.2,212.9],[379.8,159.3,390.5,212.9],[321.2,209.0,373.8,222.8]] },
];
const LOBBY_BUILDING_IMAGES = {};
LOBBY_BUILDINGS.forEach(b=>{
  const img = new Image();
  const rec = { img, loaded:false };
  img.onload = ()=>{ rec.loaded = true; };
  img.src = b.sprite;
  LOBBY_BUILDING_IMAGES[b.name] = rec;
});
function pointInBox(px,py,r){ return px>r[0] && px<r[2] && py>r[1] && py<r[3]; }
function canMoveInLobby(px,py){
  for(const b of LOBBY_BUILDINGS){
    for(const r of b.blocks){
      if(pointInBox(px,py,r)) return false;
    }
  }
  return true;
}

let keysHeld = {};
function initKeyboard(){
  // FIX BUG: kalau layar kehilangan fokus saat tombol arah sedang ditekan (notifikasi masuk,
  // ganti app, dll), lepas semua tombol supaya karakter gak jalan terus tanpa disadari.
  window.addEventListener("blur", ()=>{
    keysHeld.left=keysHeld.right=keysHeld.up=keysHeld.down=false;
    if(dodgeGame) dodgeGame.keys.left=dodgeGame.keys.right=dodgeGame.keys.up=dodgeGame.keys.down=false;
    dodgeVec.x = 0; dodgeVec.y = 0;
  });
  window.addEventListener("keydown", e=>{
    const k = e.key.toLowerCase();
    if(["arrowleft","a"].includes(k)) keysHeld.left=true;
    if(["arrowright","d"].includes(k)) keysHeld.right=true;
    if(["arrowup","w"].includes(k)) keysHeld.up=true;
    if(["arrowdown","s"].includes(k)) keysHeld.down=true;
    if(dodgeGame){
      if(["arrowleft","a"].includes(k)) dodgeGame.keys.left=true;
      if(["arrowright","d"].includes(k)) dodgeGame.keys.right=true;
      if(["arrowup","w"].includes(k)) dodgeGame.keys.up=true;
      if(["arrowdown","s"].includes(k)) dodgeGame.keys.down=true;
    }
  });
  window.addEventListener("keyup", e=>{
    const k = e.key.toLowerCase();
    if(["arrowleft","a"].includes(k)) keysHeld.left=false;
    if(["arrowright","d"].includes(k)) keysHeld.right=false;
    if(["arrowup","w"].includes(k)) keysHeld.up=false;
    if(["arrowdown","s"].includes(k)) keysHeld.down=false;
    if(dodgeGame){
      if(["arrowleft","a"].includes(k)) dodgeGame.keys.left=false;
      if(["arrowright","d"].includes(k)) dodgeGame.keys.right=false;
      if(["arrowup","w"].includes(k)) dodgeGame.keys.up=false;
      if(["arrowdown","s"].includes(k)) dodgeGame.keys.down=false;
    }
  });
}
let dodgeVec = {x:0, y:0}; // arah analog stick kotak pertarungan (-1..1 tiap sumbu)
function initAnalogStick(){
  const stick = document.getElementById("dodge-joy");
  const knob = document.getElementById("dodge-knob");
  if(!stick || !knob) return;
  let active = false, centerX=0, centerY=0, maxR=1;
  function start(clientX, clientY){
    const rect = stick.getBoundingClientRect();
    centerX = rect.left+rect.width/2; centerY = rect.top+rect.height/2;
    maxR = rect.width/2;
    active = true;
    move(clientX, clientY);
  }
  function move(clientX, clientY){
    if(!active) return;
    let dx = clientX-centerX, dy = clientY-centerY;
    const dist = Math.sqrt(dx*dx+dy*dy);
    if(dist > maxR){ dx = dx/dist*maxR; dy = dy/dist*maxR; }
    knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    dodgeVec.x = dx/maxR; dodgeVec.y = dy/maxR;
  }
  function end(){
    active = false;
    knob.style.transform = "translate(-50%,-50%)";
    dodgeVec.x = 0; dodgeVec.y = 0;
  }
  stick.addEventListener("touchstart", e=>{ e.preventDefault(); const t=e.touches[0]; start(t.clientX,t.clientY); });
  stick.addEventListener("touchmove", e=>{ e.preventDefault(); const t=e.touches[0]; move(t.clientX,t.clientY); });
  stick.addEventListener("touchend", e=>{ e.preventDefault(); end(); });
  stick.addEventListener("touchcancel", e=>{ e.preventDefault(); end(); });
  stick.addEventListener("mousedown", e=>{ start(e.clientX,e.clientY); });
  window.addEventListener("mousemove", e=>{ if(active) move(e.clientX,e.clientY); });
  window.addEventListener("mouseup", ()=>{ if(active) end(); });
}
function bindJoystick(prefix, targetKeys){
  ["left","right","up","down"].forEach(dir=>{
    const btn = document.getElementById(`${prefix}-${dir}`);
    if(!btn) return;
    const on = ()=> targetKeys[dir]=true;
    const off = ()=> targetKeys[dir]=false;
    btn.addEventListener("touchstart", e=>{e.preventDefault(); on();});
    // FIX BUG: sebelumnya cuma dengar "touchend" — kalau gestur disela sistem (mis. mau nampilin
    // menu pilih-teks), touchend kadang gak pernah terpanggil, jadi tombol kerasa "nyangkut" terus
    // jalan padahal udah dilepas. "touchcancel" jadi jaring pengaman kedua utk kasus itu.
    btn.addEventListener("touchend", e=>{e.preventDefault(); off();});
    btn.addEventListener("touchcancel", e=>{e.preventDefault(); off();});
    btn.addEventListener("contextmenu", e=>e.preventDefault());
    btn.addEventListener("mousedown", on);
    btn.addEventListener("mouseup", off);
    btn.addEventListener("mouseleave", off);
  });
}

let overworldLoop = null;
function renderOverworld(){
  // Jaga-jaga: kalau posisi tersimpan (save lama) kebetulan jatuh di dalam dinding baru, pindahkan
  // ke titik aman supaya karakter gak nyangkut gak bisa gerak sama sekali.
  if(!canMoveInLobby(player.pos.x, player.pos.y)) player.pos = {x:330, y:280};
  document.getElementById("hud-coins").textContent = formatCoin(player.coins);
  document.getElementById("hud-hp").textContent = `${player.hp}/${player.maxHp}`;
  const lvlEl = document.getElementById("hud-level"); if(lvlEl) lvlEl.textContent = `Lv.${player.level}`;
  const canvas = document.getElementById("overworld-canvas");
  if(overworldLoop) cancelAnimationFrame(overworldLoop);
  function loop(){
    if(document.getElementById("screen-overworld").style.display==="none") return;
    const spd = 3.2;
    let nx = player.pos.x + (keysHeld.right?spd:0) - (keysHeld.left?spd:0);
    nx = Math.max(20, Math.min(680, nx));
    if(canMoveInLobby(nx, player.pos.y)) player.pos.x = nx;
    let ny = player.pos.y + (keysHeld.down?spd:0) - (keysHeld.up?spd:0);
    ny = Math.max(20, Math.min(447, ny));
    if(canMoveInLobby(player.pos.x, ny)) player.pos.y = ny;
    player.isMoving = updateFacingFromKeys(keysHeld);
    drawOverworld(canvas);
    overworldLoop = requestAnimationFrame(loop);
  }
  loop();
}
function drawOverworld(canvas){
  const ctx = canvas.getContext("2d");
  if(lobbyBgLoaded){
    ctx.drawImage(lobbyBg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#1b2a1f"; ctx.fillRect(0,0,canvas.width,canvas.height);
  }
  const merchantB = LOBBY_BUILDINGS.find(b=>b.action==="merchant");
  if(merchantB) drawMonsterSprite(ctx, "wierd_traveler", merchantB.sx+merchantB.dw*0.22, merchantB.sy+merchantB.dh*0.88, 28, true);
  drawPlayerSprite(ctx, player.pos.x, player.pos.y, player.facing, player.isMoving);

  // FITUR: gambar ulang tiap bangunan DI ATAS pemain — jadi bangunan yg kelihatan "menembus" pemain
  // (pemain tampak masuk ke balik pintu/bayangan bangunan), bukan pemain yg nembus bangunan.
  LOBBY_BUILDINGS.forEach(b=>{
    const rec = LOBBY_BUILDING_IMAGES[b.name];
    if(rec && rec.loaded){
      ctx.drawImage(rec.img, b.sx, b.sy, b.dw, b.dh);
    }
  });

  // FIX BUG: sebelumnya loop ini tetap jalan walau modal (toko/guild/dll) lagi kebuka, jadi kalau
  // pemain masih berdiri di kotak pintu, begitu jeda 3 detik habis, modal ke-trigger buka ULANG dari
  // nol (tab yg lagi dipilih ke-reset balik ke default). Sekarang di-skip total selama ada modal aktif.
  if(!isAnyModalOpen()){
    LOBBY_BUILDINGS.forEach(b=>{
      if(!b.action || !b.door) return;
      if(pointInBox(player.pos.x, player.pos.y, b.door)){
        enterBuilding(b.action);
      }
    });
  }
}
let lastEnter = 0;
function enterBuilding(action){
  const now = Date.now();
  if(now-lastEnter < 3000) return; // jeda ~3 detik sebelum trigger bangunan (shop/guild/dll) bisa aktif lagi
  lastEnter = now;
  if(action==="guild") openGuild();
  if(action==="shop") openShop();
  if(action==="merchant") openMerchant();
  if(action==="dungeon_select") openDungeonSelect();
  if(action==="inn") openInn();
  if(action==="bank") openBank();
  if(action==="blacksmith") openBlacksmith();
  if(action==="market") openMarket();
  if(action==="questboard") openQuestBoard();
}
function goToLobby(){
  player.currentFloor = 0;
  player.pos = {x:330,y:280};
  showScreen("screen-overworld");
  renderOverworld();
  persist();
}

/* ============================== DUNGEON (2D, banyak lantai per dungeon) ============================== */
let dungeonMonsters = [];
let dungeonReentryGrace = 0;
let floorFlashUntil = 0;
let exitArmed = true;
let stairsArmed = true;
function enterDungeon(dungeonId, subFloor){
  subFloor = subFloor || 1;
  player.currentFloor = dungeonId;
  player.currentSubFloor = subFloor;
  floorFlashUntil = Date.now() + 1500; // tampilkan notifikasi lantai sebentar
  // FIX: spawn di tengah lantai (bukan nempel pintu kiri) biar gak berasa "balik ke lantai
  // sebelumnya terus" tiap pindah lantai — sekarang harus jalan dulu ke pintu/tangga yg dituju.
  player.pos = {x:350,y:260};
  player.dungeonSubProgress[dungeonId] = Math.max(player.dungeonSubProgress[dungeonId]||1, subFloor);
  const d = DUNGEONS.find(x=>x.id===dungeonId);
  const totalFloors = dungeonFloors(dungeonId);
  const isLastFloor = subFloor>=totalFloors;
  dungeonMonsters = [];
  if(d.finalBoss || isLastFloor){
    dungeonMonsters.push({ x:640, y:200, alive:true, isBoss:true, uid:"boss", spriteKey: pickMonsterSprite(dungeonId,true) });
  } else {
    const key = dungeonId+"_"+subFloor;
    const killed = player.floorProgress[key]||0;
    const need = monstersPerSubfloor(dungeonId);
    const remain = Math.max(0, need-killed);
    for(let i=0;i<Math.min(remain,8);i++){
      const sp = findWalkableSpawn(dungeonId);
      dungeonMonsters.push({ x:sp.x, y:sp.y, alive:true, isBoss:false, uid:"m"+i, spriteKey: pickMonsterSprite(dungeonId,false) });
    }
    if(remain<=0){
      dungeonMonsters.push({ x:640, y:220, alive:true, isStairs:true, uid:"stairs" });
    }
  }
  showScreen("screen-dungeon");
  renderDungeon();
}
function removeCurrentMonsterSprite(monster){
  const idx = dungeonMonsters.findIndex(m=>m.alive && !m.isStairs && (m.isBoss===monster.isBoss));
  if(idx>=0) dungeonMonsters[idx].alive = false;
}
let dungeonLoop = null;
function renderDungeon(){
  document.getElementById("hud-coins-d").textContent = formatCoin(player.coins);
  document.getElementById("hud-hp-d").textContent = `${player.hp}/${player.maxHp}`;
  const lvlEl = document.getElementById("hud-level-d"); if(lvlEl) lvlEl.textContent = `Lv.${player.level}`;
  const d = DUNGEONS.find(x=>x.id===player.currentFloor);
  const totalFloors = dungeonFloors(d.id);
  document.getElementById("dungeon-title").textContent = `${d.name} — Lantai ${player.currentSubFloor}/${totalFloors}`;
  const canvas = document.getElementById("dungeon-canvas");
  if(dungeonLoop) cancelAnimationFrame(dungeonLoop);
  function loop(){
    if(document.getElementById("screen-dungeon").style.display==="none") return;
    const spd = 3.2;
    let nx = player.pos.x + (keysHeld.right?spd:0) - (keysHeld.left?spd:0);
    nx = Math.max(15, Math.min(canvas.width-15, nx));
    if(canMoveInDungeon(nx, player.pos.y, canvas, d.id)) player.pos.x = nx;
    let ny = player.pos.y + (keysHeld.down?spd:0) - (keysHeld.up?spd:0);
    ny = Math.max(15, Math.min(canvas.height-15, ny));
    if(canMoveInDungeon(player.pos.x, ny, canvas, d.id)) player.pos.y = ny;
    player.isMoving = updateFacingFromKeys(keysHeld);
    drawDungeon(canvas, d);
    dungeonLoop = requestAnimationFrame(loop);
  }
  loop();
}
function drawDungeon(canvas, d){
  const ctx = canvas.getContext("2d");
  const bg = DUNGEON_BG_IMAGES[d.id];
  if(bg && bg.loaded){
    ctx.drawImage(bg.img, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#161018"; ctx.fillRect(0,0,canvas.width,canvas.height);
  }
  // FITUR: tiap dungeon cuma punya 1 gambar latar (dipakai bersama semua lantai di dalamnya),
  // jadi lantai 1 & lantai 2 dst kelihatan identik dan bikin bingung "kok balik ke lantai 1?".
  // Kasih overlay makin gelap & kemerahan tiap makin dalam lantainya biar kelihatan bedanya.
  const floorTint = Math.min(0.42, (player.currentSubFloor-1)*0.07);
  if(floorTint>0){
    ctx.fillStyle = `rgba(25,4,10,${floorTint})`;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
  ctx.strokeStyle="rgba(74,58,85,0.5)";
  ctx.strokeRect(0,0,canvas.width,canvas.height);
  // Notifikasi singkat nama lantai saat baru masuk/pindah lantai, biar keliatan jelas beda lantainya
  const flashLeft = floorFlashUntil - Date.now();
  if(flashLeft > 0){
    const fade = flashLeft>300 ? 1 : flashLeft/300;
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.font="bold 22px sans-serif"; ctx.textAlign="center";
    ctx.fillStyle="rgba(0,0,0,0.55)";
    ctx.fillRect(canvas.width/2-140, 16, 280, 34);
    ctx.fillStyle="#ffd27a";
    const totalFloors = dungeonFloors(d.id);
    ctx.fillText(`Lantai ${player.currentSubFloor} / ${totalFloors}`, canvas.width/2, 40);
    ctx.restore();
  }
  ctx.font="30px serif"; ctx.textAlign="center";
  ctx.fillText("🚪", 25, 300);
  ctx.font="11px sans-serif"; ctx.fillStyle="#fff"; ctx.shadowColor="#000"; ctx.shadowBlur=4;
  ctx.fillText(player.currentSubFloor>1?"Ke Lantai "+(player.currentSubFloor-1): (d.id===1?"Ke Lobby":"Ke Dungeon Sebelumnya"), 25, 320);
  ctx.shadowBlur=0;

  dungeonMonsters.filter(m=>m.alive).forEach(m=>{
    if(m.isStairs){
      ctx.font="34px serif"; ctx.textAlign="center"; ctx.fillText("⬆️", m.x, m.y);
      ctx.font="11px sans-serif"; ctx.fillStyle="#bfffcf"; ctx.fillText("Lantai Berikutnya", m.x, m.y+16);
      return;
    }
    const size = m.isBoss ? 56 : 40;
    drawMonsterSprite(ctx, m.spriteKey, m.x, m.y, size, true);
    if(m.isBoss){ ctx.font="12px sans-serif"; ctx.fillStyle="#ffb3b3"; ctx.textAlign="center"; ctx.fillText("BOSS", m.x, m.y+14); }
  });
  drawPlayerSprite(ctx, player.pos.x, player.pos.y, player.facing, player.isMoving);

  // FIX BUG: sebelumnya kalau tombol kiri masih ditahan pas nembus pintu keluar, begitu pindah ke
  // lantai baru posisinya masih deket sama pintu itu lagi → langsung ke-trigger keluar LAGI berkali-
  // kali selama tombolnya belum dilepas (bablas lompat beberapa lantai sekaligus tanpa disadari).
  // Sekarang wajib lepas tombol dulu sebelum bisa trigger pintu/tangga lagi.
  if(!keysHeld.left) exitArmed = true;
  if(!keysHeld.right) stairsArmed = true;

  if(player.pos.x<45 && Math.abs(player.pos.y-300)<40){
    if(exitArmed && !isAnyModalOpen()){ exitArmed = false; exitDungeonOneLevel(); }
    return;
  }
  if(Date.now() < dungeonReentryGrace) return; // FIX BUG: jangan cek tabrakan dulu selama jeda re-entry
  if(isAnyModalOpen()) return; // FIX BUG: jangan cek tabrakan monster/tangga selama modal (Tas/Skill) lagi kebuka
  dungeonMonsters.filter(m=>m.alive).forEach(m=>{
    const dx=player.pos.x-m.x, dy=player.pos.y-m.y;
    if(Math.sqrt(dx*dx+dy*dy) < 30){
      if(m.isStairs){
        if(!stairsArmed) return;
        stairsArmed = false;
        enterDungeon(player.currentFloor, player.currentSubFloor+1);
        return;
      }
      const monster = makeMonster(player.currentFloor, player.currentSubFloor, m.isBoss, m.spriteKey);
      startBattle(monster);
    }
  });
}
let lastExit=0;
function exitDungeonOneLevel(){
  const now=Date.now(); if(now-lastExit<1500) return; lastExit=now; // jeda ~1,5 detik sebelum bisa trigger keluar dungeon lagi
  if(player.currentSubFloor>1){
    enterDungeon(player.currentFloor, player.currentSubFloor-1);
  } else if(player.currentFloor<=1){
    goToLobby();
  } else {
    const prevD = player.currentFloor-1;
    enterDungeon(prevD, dungeonFloors(prevD));
  }
}
function openDungeonSelect(){
  const list = document.getElementById("dungeon-select-list");
  list.innerHTML = "";
  DUNGEONS.forEach(d=>{
    const unlocked = d.id===1 || player.dungeonCleared[d.id-1];
    const totalFloors = dungeonFloors(d.id);
    const resumeFloor = player.dungeonSubProgress[d.id]||1;
    const div = document.createElement("div");
    div.className = "list-item"+(unlocked?"":" locked");
    div.innerHTML = `<span><b>Dungeon ${d.id}: ${d.name}</b><br><small>${d.finalBoss? "Bos Terakhir: "+d.boss : (totalFloors+" lantai • Bos: "+d.boss)}${unlocked?` • Lanjut dari lantai ${Math.min(resumeFloor,totalFloors)}`:""}</small></span>`;
    if(unlocked) div.onclick = ()=>{ closeAllModals(); enterDungeon(d.id, Math.min(resumeFloor,totalFloors)); };
    list.appendChild(div);
  });
  document.getElementById("modal-dungeon-select").style.display="flex";
}

/* ============================== GUILD (Jual Kristal) ============================== */
function openGuild(){
  renderGuild();
  document.getElementById("modal-guild").style.display="flex";
}
function renderGuild(){
  document.getElementById("guild-coins").textContent = formatCoin(player.coins);
  const list = document.getElementById("guild-crystal-list");
  list.innerHTML = "";
  CRYSTAL_TYPES.forEach(c=>{
    const qty = player.crystals[c.key]||0;
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `<span>${c.icon} ${c.name} x${qty} <small>(nilai ${c.sellRate}C/pcs)</small></span>
      <button ${qty<=0?"disabled":""} onclick="sellCrystal('${c.key}')">Jual Semua</button>`;
    list.appendChild(div);
  });
}
function sellCrystal(key){
  const c = CRYSTAL_TYPES.find(x=>x.key===key);
  const qty = player.crystals[key]||0;
  if(qty<=0) return;
  player.coins += qty*c.sellRate;
  player.crystals[key] = 0;
  persist();
  renderGuild();
}

/* ============================== SHOP (Senjata/Armor/Amulet) ============================== */
let shopTab = "weapon";
function openShop(){
  shopTab="weapon";
  renderShop();
  document.getElementById("modal-shop").style.display="flex";
}
function setShopTab(tab){ shopTab=tab; renderShop(); }
function iconHtml(icon){
  if(typeof icon==="string" && icon.endsWith(".png")) return `<img src="${icon}" class="item-icon" alt="">`;
  return icon;
}
function itemExtraLabel(item){
  const extra = [];
  if(item.crit) extra.push(`Crit +${item.crit}%`);
  if(item.bonusHp) extra.push(`HP +${item.bonusHp}`);
  if(item.bonusDef) extra.push(`DEF +${item.bonusDef}`);
  if(item.bonusAtk) extra.push(`ATK +${item.bonusAtk}`);
  return extra.length ? ` <small style="color:var(--accent2)">[${extra.join(', ')}]</small>` : "";
}
function renderShop(){
  document.getElementById("shop-coins").textContent = formatCoin(player.coins);
  document.querySelectorAll("#modal-shop .tabs button").forEach(btn=>btn.classList.remove("active"));
  const tabIdx = shopTab==="weapon"?0:shopTab==="armor"?1:2;
  const tabBtns = document.querySelectorAll("#modal-shop .tabs button");
  if(tabBtns[tabIdx]) tabBtns[tabIdx].classList.add("active");
  const list = document.getElementById("shop-list");
  list.innerHTML = "";
  let items = shopTab==="weapon"?WEAPONS: shopTab==="armor"?ARMORS: AMULETS;
  items.filter(i=>!i.starter).forEach(item=>{
    const owned = shopTab==="amulet" ? player.inventory.amulets.includes(item.id)
      : shopTab==="weapon" ? player.inventory.weapons.includes(item.id)
      : player.inventory.armors.includes(item.id);
    const stat = item.cat==="armor" ? `DEF +${item.def}` : `ATK +${item.atk}`;
    const priceLabel = item.crystalReq ? `${item.price}C + ${item.crystalCost}x ${CRYSTAL_TYPES.find(c=>c.key===item.crystalReq).name}` : `${item.price}C`;
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `<span>${iconHtml(item.icon)} ${item.name} <small>(${stat})</small>${itemExtraLabel(item)}<br><small>Harga: ${priceLabel}</small></span>
      <button ${owned?"disabled":""} onclick="buyItem('${item.cat}','${item.id}')">${owned?"Dimiliki":"Beli"}</button>`;
    list.appendChild(div);
  });
}
function buyItem(cat, id){
  const item = cat==="weapon"?getWeapon(id): cat==="armor"?getArmor(id): getAmulet(id);
  if(!item) return;
  if(player.coins < item.price){ alert("Coin tidak cukup!"); return; }
  if(item.crystalReq && (player.crystals[item.crystalReq]||0) < item.crystalCost){ alert("Kristal tidak cukup!"); return; }
  player.coins -= item.price;
  if(item.crystalReq) player.crystals[item.crystalReq] -= item.crystalCost;
  if(cat==="weapon") player.inventory.weapons.push(id);
  if(cat==="armor") player.inventory.armors.push(id);
  if(cat==="amulet") player.inventory.amulets.push(id);
  persist();
  renderShop();
}

/* ============================== MERCHANT (Potion) ============================== */
function openMerchant(){
  renderMerchant();
  document.getElementById("modal-merchant").style.display="flex";
}
function renderMerchant(){
  document.getElementById("merchant-coins").textContent = formatCoin(player.coins);
  const list = document.getElementById("merchant-list");
  list.innerHTML = "";
  POTIONS.forEach(p=>{
    const owned = player.inventory.potions[p.id]||0;
    const div = document.createElement("div");
    div.className="list-item";
    div.innerHTML = `<span>${p.icon} ${p.name} x${owned} <br><small>Harga: ${p.price}C</small></span>
      <button onclick="buyPotion('${p.id}')">Beli</button>`;
    list.appendChild(div);
  });
}
function buyPotion(id){
  const p = getPotion(id);
  if(player.coins < p.price){ alert("Coin tidak cukup!"); return; }
  player.coins -= p.price;
  player.inventory.potions[id] = (player.inventory.potions[id]||0)+1;
  persist();
  renderMerchant();
}

/* ============================== PENGINAPAN (INN) ============================== */
function openInn(){
  document.getElementById("inn-hp").textContent = `${player.hp}/${player.maxHp}`;
  document.getElementById("modal-inn").style.display="flex";
}
function restAtInn(){
  player.hp = player.maxHp;
  persist();
  document.getElementById("inn-hp").textContent = `${player.hp}/${player.maxHp}`;
}

/* ============================== BANK ============================== */
function openBank(){
  const c = coinToDisplay(player.coins);
  document.getElementById("bank-content").innerHTML = `
    <div class="list-item"><span>🌟 Platinum</span><b>${c.platinum}</b></div>
    <div class="list-item"><span>🟡 Gold</span><b>${c.gold}</b></div>
    <div class="list-item"><span>⚪ Perak</span><b>${c.perak}</b></div>
    <div class="list-item"><span>🟤 Perunggu</span><b>${c.perunggu}</b></div>
    <p style="font-size:0.75em;color:var(--muted);margin-top:8px;">Total: ${formatCoin(player.coins)} (1 Platinum = 100 Gold = 10.000 Perak = 1.000.000 Perunggu)</p>
  `;
  document.getElementById("modal-bank").style.display="flex";
}

/* ============================== TUKANG BESI (UPGRADE) ============================== */
const MAX_UPGRADE_LEVEL = 10;
function upgradeCost(level){ return (level+1)*350; }
function openBlacksmith(){
  document.getElementById("blacksmith-coins").textContent = formatCoin(player.coins);
  const w = getWeapon(player.equipped.weapon);
  const a = getArmor(player.equipped.armor);
  let html = "";
  if(w){
    const lvl = getUpgradeLevel(w.id);
    const maxed = lvl>=MAX_UPGRADE_LEVEL;
    const cost = upgradeCost(lvl);
    html += `<div class="list-item"><span>${iconHtml(w.icon)} ${w.name} (+${lvl*4} ATK dari upgrade, Lv.${lvl}/${MAX_UPGRADE_LEVEL})</span>
      <button ${maxed||player.coins<cost?"disabled":""} onclick="upgradeItem('${w.id}')">${maxed?"MAX":`Upgrade (${cost}C)`}</button></div>`;
  } else {
    html += `<small>Tidak ada senjata terpasang.</small>`;
  }
  if(a){
    const lvl = getUpgradeLevel(a.id);
    const maxed = lvl>=MAX_UPGRADE_LEVEL;
    const cost = upgradeCost(lvl);
    html += `<div class="list-item"><span>${iconHtml(a.icon)} ${a.name} (+${lvl*3} DEF dari upgrade, Lv.${lvl}/${MAX_UPGRADE_LEVEL})</span>
      <button ${maxed||player.coins<cost?"disabled":""} onclick="upgradeItem('${a.id}')">${maxed?"MAX":`Upgrade (${cost}C)`}</button></div>`;
  } else {
    html += `<small>Tidak ada armor terpasang.</small>`;
  }
  document.getElementById("blacksmith-content").innerHTML = html;
  document.getElementById("modal-blacksmith").style.display="flex";
}
function upgradeItem(itemId){
  const lvl = getUpgradeLevel(itemId);
  if(lvl>=MAX_UPGRADE_LEVEL) return;
  const cost = upgradeCost(lvl);
  if(player.coins < cost){ alert("Coin tidak cukup!"); return; }
  player.coins -= cost;
  player.upgradeLevels[itemId] = lvl+1;
  persist();
  openBlacksmith();
}

/* ============================== PASAR (JUAL GEAR) ============================== */
function openMarket(){
  document.getElementById("market-coins").textContent = formatCoin(player.coins);
  let html = "<h3>⚔️ Senjata</h3>";
  player.inventory.weapons.filter(id=>!getWeapon(id).starter).forEach(id=>{
    const w = getWeapon(id);
    const eq = player.equipped.weapon===id;
    html += `<div class="list-item"><span>${iconHtml(w.icon)} ${w.name}${eq?" (dipakai)":""}</span><button onclick="sellItem('weapon','${id}')">Jual (${Math.round(w.price*0.4)}C)</button></div>`;
  });
  html += "<h3>🛡️ Armor</h3>";
  if(player.inventory.armors.length===0) html += "<small>Tidak ada.</small>";
  player.inventory.armors.forEach(id=>{
    const a = getArmor(id);
    const eq = player.equipped.armor===id;
    html += `<div class="list-item"><span>${iconHtml(a.icon)} ${a.name}${eq?" (dipakai)":""}</span><button onclick="sellItem('armor','${id}')">Jual (${Math.round(a.price*0.4)}C)</button></div>`;
  });
  html += "<h3>💫 Amulet</h3>";
  if(player.inventory.amulets.length===0) html += "<small>Tidak ada.</small>";
  player.inventory.amulets.forEach(id=>{
    const am = getAmulet(id);
    const eq = player.equipped.amulet===id;
    html += `<div class="list-item"><span>${iconHtml(am.icon)} ${am.name}${eq?" (dipakai)":""}</span><button onclick="sellItem('amulet','${id}')">Jual (${Math.round(am.price*0.4)}C)</button></div>`;
  });
  document.getElementById("market-content").innerHTML = html;
  document.getElementById("modal-market").style.display="flex";
}
function sellItem(cat, id){
  const item = cat==="weapon"?getWeapon(id): cat==="armor"?getArmor(id): getAmulet(id);
  if(!item) return;
  const refund = Math.round(item.price*0.4);
  player.coins += refund;
  const list = cat==="weapon"?player.inventory.weapons: cat==="armor"?player.inventory.armors: player.inventory.amulets;
  const idx = list.indexOf(id);
  if(idx>=0) list.splice(idx,1);
  if(player.equipped[cat]===id) player.equipped[cat] = cat==="weapon" ? "w_Pedang_kayu" : null;
  delete player.upgradeLevels[id];
  player.maxHp = computeMaxHp();
  if(player.hp>player.maxHp) player.hp=player.maxHp;
  persist();
  openMarket();
}

/* ============================== PAPAN MISI (QUEST) ============================== */
const QUEST_LIST = [
  {id:"q1", desc:"Setor 5x Kristal Biasa 🔹", key:"biasa", qty:5, reward:1000},
  {id:"q2", desc:"Setor 3x Kristal Langka 🔷", key:"langka", qty:3, reward:5000},
  {id:"q3", desc:"Setor 2x Kristal Epik 💎", key:"epik", qty:2, reward:20000},
  {id:"q4", desc:"Setor 1x Kristal Mistis 🟣", key:"mistis", qty:1, reward:70000},
  {id:"q5", desc:"Setor 1x Kristal Legendaris 🌟", key:"legendaris", qty:1, reward:300000},
];
function openQuestBoard(){
  let html = "";
  QUEST_LIST.forEach(q=>{
    const have = player.crystals[q.key]||0;
    const ready = have>=q.qty;
    html += `<div class="list-item"><span>${q.desc}<br><small>Punya: ${have}/${q.qty} • Hadiah: ${q.reward}C</small></span>
      <button ${ready?"":"disabled"} onclick="claimQuest('${q.id}')">Klaim</button></div>`;
  });
  document.getElementById("quest-content").innerHTML = html;
  document.getElementById("modal-quest").style.display="flex";
}
function claimQuest(id){
  const q = QUEST_LIST.find(x=>x.id===id);
  if(!q) return;
  if((player.crystals[q.key]||0) < q.qty) return;
  player.crystals[q.key] -= q.qty;
  player.coins += q.reward;
  persist();
  openQuestBoard();
}

/* ============================== EQUIP & INVENTORY MODAL ============================== */
function openInventory(){
  renderInventory();
  document.getElementById("modal-inventory").style.display="flex";
}
function renderInventory(){
  const wrap = document.getElementById("inv-content");
  let html = `<div class="list-item"><span>🧙 Level ${player.level} <small>(XP ${player.xp}/${xpForLevel(player.level)})</small></span><b>🔹${player.skillPoints} Poin Skill</b></div>`;
  html += `<div class="list-item"><span>⚔️ ATK ${playerTotalAtk()} • 🛡️ DEF ${playerTotalDef()} • 🎯 Crit ${playerTotalCrit()}%</span><button onclick="closeAllModals();openSkillTree();">🌳 Pohon Skill</button></div>`;
  html += `<h3>⚔️ Senjata</h3>`;
  player.inventory.weapons.forEach(id=>{
    const w = getWeapon(id);
    const eq = player.equipped.weapon===id;
    const lvl = getUpgradeLevel(id);
    html += `<div class="list-item"><span>${iconHtml(w.icon)} ${w.name} (ATK+${w.atk}${lvl>0?`, +${lvl*4} upgrade`:""})${itemExtraLabel(w)}</span><button ${eq?"disabled":""} onclick="equipItem('weapon','${id}')">${eq?"Terpakai":"Pakai"}</button></div>`;
  });
  html += `<h3>🛡️ Armor</h3>`;
  if(player.inventory.armors.length===0) html += `<small>Belum punya armor.</small>`;
  player.inventory.armors.forEach(id=>{
    const a = getArmor(id);
    const eq = player.equipped.armor===id;
    const lvl = getUpgradeLevel(id);
    html += `<div class="list-item"><span>${iconHtml(a.icon)} ${a.name} (DEF+${a.def}${lvl>0?`, +${lvl*3} upgrade`:""})${itemExtraLabel(a)}</span><button ${eq?"disabled":""} onclick="equipItem('armor','${id}')">${eq?"Terpakai":"Pakai"}</button></div>`;
  });
  html += `<h3>💫 Amulet</h3>`;
  if(player.inventory.amulets.length===0) html += `<small>Belum punya amulet.</small>`;
  player.inventory.amulets.forEach(id=>{
    const a = getAmulet(id);
    const eq = player.equipped.amulet===id;
    html += `<div class="list-item"><span>${iconHtml(a.icon)} ${a.name} (ATK+${a.atk}/DEF+${a.def})${itemExtraLabel(a)}</span><button ${eq?"disabled":""} onclick="equipItem('amulet','${id}')">${eq?"Terpakai":"Pakai"}</button></div>`;
  });
  html += `<h3>📜 Skill Dipelajari (${player.skills.length})</h3>`;
  if(player.skills.length===0) html += `<small>Belum ada skill. Buka Pohon Skill untuk mempelajarinya.</small>`;
  player.skills.forEach(sid=>{
    const s = getSkill(sid);
    if(!s) return;
    html += `<div class="list-item"><span>${skillIconHtml(s)}${s.name}</span><small>${s.desc}</small></div>`;
  });
  wrap.innerHTML = html;
}
function equipItem(cat, id){
  player.equipped[cat] = id;
  player.maxHp = computeMaxHp();
  if(player.hp>player.maxHp) player.hp=player.maxHp;
  persist();
  renderInventory();
}

/* ============================== POHON SKILL ============================== */
function skillIconHtml(s){
  return s.effectFile ? `<span class="skill-icon" style="background-image:url('${s.effectFile}')"></span>` : "";
}
function openSkillTree(){
  renderSkillTree();
  document.getElementById("modal-skilltree").style.display="flex";
}
function renderSkillTree(){
  document.getElementById("skilltree-points").textContent = player.skillPoints;
  const branches = skillTreeBranches();
  let html = "";
  Object.keys(branches).forEach(bkey=>{
    const chain = branches[bkey];
    const label = bkey.startsWith("el_") ? `✨ Elemen ${bkey.slice(3)}` : bkey==="weapon_mastery" ? "⚔️ Mastery Senjata" : bkey;
    html += `<h3>${label}</h3>`;
    chain.forEach(s=>{
      const learned = player.skills.includes(s.id);
      const can = canLearnTreeSkill(s);
      let status = learned ? "Dipelajari" : can ? `Pelajari (${s.cost} Poin)` : "Terkunci";
      html += `<div class="list-item"><span>${skillIconHtml(s)}${s.name}<br><small>${s.desc||''}</small></span>
        <button ${(!can)?"disabled":""} onclick="learnTreeSkill('${s.id}')">${status}</button></div>`;
    });
  });
  document.getElementById("skilltree-content").innerHTML = html;
}

/* ============================== MODAL HELPERS ============================== */
function isAnyModalOpen(){
  return Array.from(document.querySelectorAll(".modal")).some(m=> m.style.display==="flex");
}
function closeAllModals(){
  document.querySelectorAll(".modal").forEach(m=>m.style.display="none");
  // FIX: jeda 3 detik dihitung dari saat modal DITUTUP (bukan saat dibuka), soalnya kalau lama
  // di dalam toko/guild lalu keluar, tanpa ini bisa langsung ke-trigger masuk lagi karena masih
  // berdiri persis di kotak pintu yg sama.
  lastEnter = Date.now();
}
function openSkillMenu(){
  const list = document.getElementById("skill-menu-list");
  const atkSkills = player.skills.map(getSkill).filter(s=>s && s.type==="attack");
  if(atkSkills.length===0){ list.innerHTML = "<small>Belum ada skill serangan.</small>"; }
  else {
    list.innerHTML = atkSkills.map(s=>{
      const cd = battle.skillCooldowns[s.id]||0;
      return `<div class="list-item"><span>${skillIconHtml(s)}${s.name}${cd>0?` (CD:${cd})`:""}</span><button ${cd>0?"disabled":""} onclick="playerUseSkill('${s.id}')">Pakai</button></div>`;
    }).join("");
  }
  document.getElementById("modal-skill-menu").style.display="flex";
}
function closeSkillMenu(){ document.getElementById("modal-skill-menu").style.display="none"; }
function openItemMenu(){
  const list = document.getElementById("item-menu-list");
  const owned = Object.entries(player.inventory.potions).filter(([id,q])=>q>0);
  if(owned.length===0){ list.innerHTML = "<small>Tidak ada item.</small>"; }
  else {
    list.innerHTML = owned.map(([id,q])=>{
      const p = getPotion(id);
      return `<div class="list-item"><span>${p.icon} ${p.name} x${q}</span><button onclick="playerUseItem('${id}')">Pakai</button></div>`;
    }).join("");
  }
  document.getElementById("modal-item-menu").style.display="flex";
}
function closeItemMenu(){ document.getElementById("modal-item-menu").style.display="none"; }

/* ============================== RENDER BATTLE UI ============================== */
function renderBattle(){
  const m = battle.monster;
  document.getElementById("enemy-name").textContent = `${m.name}${m.isBoss?" 👑 (BOSS)":""}`;
  document.getElementById("enemy-hp-bar").style.width = Math.max(0,(m.hp/m.maxHp*100))+"%";
  document.getElementById("enemy-hp-text").textContent = `${Math.max(0,m.hp)}/${m.maxHp}`;
  document.getElementById("player-hp-bar").style.width = Math.max(0,(player.hp/player.maxHp*100))+"%";
  document.getElementById("player-hp-text").textContent = `${Math.max(0,player.hp)}/${player.maxHp}`;
  const logEl = document.getElementById("battle-log");
  logEl.innerHTML = battle.log.map(l=>`<div>${l}</div>`).join("");
}

/* ============================== LOGIN / REGISTER UI ============================== */
function doLogin(){
  const u = document.getElementById("login-username").value.trim();
  const p = document.getElementById("login-password").value;
  const r = loginAccount(u,p);
  const msg = document.getElementById("login-msg");
  if(!r.ok){ msg.textContent = r.msg; return; }
  msg.textContent = "";
  enterGame();
}
function doRegister(){
  const u = document.getElementById("login-username").value.trim();
  const p = document.getElementById("login-password").value;
  const e = document.getElementById("login-email").value.trim();
  const r = registerAccount(u,p,e);
  const msg = document.getElementById("login-msg");
  if(!r.ok){ msg.textContent = r.msg; return; }
  msg.textContent = "Akun dibuat! Silakan login.";
}
function enterGame(){
  showScreen("screen-overworld");
  renderOverworld();
}

/* ============================== LAYAR PENUH & LANDSCAPE ============================== */
function goFullscreen(){
  const el = document.documentElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
  const doLock = ()=>{
    if(screen.orientation && screen.orientation.lock){
      screen.orientation.lock("landscape").catch(()=>{});
    }
  };
  if(req){
    req.call(el).then(doLock).catch(()=>{ doLock(); });
  } else {
    doLock();
  }
}

/* ============================== INIT ============================== */
function initGame(){
  initKeyboard();
  bindJoystick("owjoy", keysHeld);
  bindJoystick("dgjoy", keysHeld);
  initAnalogStick();
  showScreen("screen-login");
}
window.addEventListener("DOMContentLoaded", initGame);
