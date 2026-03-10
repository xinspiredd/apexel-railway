// parts.js - Полный каталог деталей из Excel-файлов
var PARTS_DATA = {
  // ========== ДВИГАТЕЛИ ==========
  engine: [
    // ★ Improved
    {id:'e_imp_1', name:'AMERIKAN SPEEDSYSTEM ★ IMPROVED ENGINE', ser:'Improved', spd:2, acc:2, hdl:0, color:'yellow'},
    {id:'e_imp_2', name:'DAWWNDRAFT ★ IMPROVED ENGINE', ser:'Improved', spd:1, acc:3, hdl:0, color:'blue'},
    {id:'e_imp_3', name:'NOVA-T ★ IMPROVED ENGINE', ser:'Improved', spd:2, acc:1, hdl:0, color:'red'},
    {id:'e_imp_4', name:'OMNIA RACEGRUPPE ★ IMPROVED ENGINE', ser:'Improved', spd:3, acc:1, hdl:0, color:'green'},
    
    // ★ Sport
    {id:'e_spt_1', name:'AMERIKAN SPEEDSYSTEM ★ SPORT ENGINE', ser:'Sport', spd:3, acc:3, hdl:0, color:'yellow'},
    {id:'e_spt_2', name:'DAWNDRAFT ★ SPORT ENGINE', ser:'Sport', spd:2, acc:4, hdl:0, color:'blue'},
    {id:'e_spt_3', name:'NOVA-T ★ SPORT ENGINE', ser:'Sport', spd:3, acc:2, hdl:0, color:'red'},
    {id:'e_spt_4', name:'OMNIA RACEGRUPPE ★ SPORT ENGINE', ser:'Sport', spd:4, acc:2, hdl:0, color:'green'},
    
    // ★ Tuned
    {id:'e_tun_1', name:'AMERIKON SPEEDSYSTEMS ★ TUNED ENGINE', ser:'Tuned', spd:4, acc:4, hdl:0, color:'yellow'},
    {id:'e_tun_2', name:'DAWNDRAFT ★ TUNED ENGINE', ser:'Tuned', spd:3, acc:4, hdl:0, color:'blue'},
    {id:'e_tun_3', name:'NOVA-T ★ TUNED ENGINE', ser:'Tuned', spd:4, acc:3, hdl:0, color:'red'},
    {id:'e_tun_4', name:'OMNIA RACEGRUPPE ★ TUNED ENGINE', ser:'Tuned', spd:4, acc:3, hdl:0, color:'green'},
    
    // ★★ Improved
    {id:'e_2imp_1', name:'GROMLEN ★★ IMPROVED ENGINE', ser:'Improved', spd:4, acc:4, hdl:0, color:'yellow'},
    {id:'e_2imp_2', name:'KESTREL ★★ IMPROVED ENGINE', ser:'Improved', spd:4, acc:6, hdl:0, color:'blue'},
    {id:'e_2imp_3', name:'NORSET ★★ IMPROVED ENGINE', ser:'Improved', spd:6, acc:4, hdl:0, color:'green'},
    {id:'e_2imp_4', name:'RICHTER ★★ IMPROVED ENGINE', ser:'Improved', spd:4, acc:4, hdl:0, color:'red'},
    
    // ★★ Sport
    {id:'e_2spt_1', name:'GROMLEN ★★ SPORT ENGINE', ser:'Sport', spd:6, acc:6, hdl:0, color:'yellow'},
    {id:'e_2spt_2', name:'KESTREL ★★ SPORT ENGINE', ser:'Sport', spd:4, acc:8, hdl:0, color:'blue'},
    {id:'e_2spt_3', name:'NORSET ★★ SPORT ENGINE', ser:'Sport', spd:8, acc:4, hdl:0, color:'green'},
    {id:'e_2spt_4', name:'RICHTER ★★ SPORT ENGINE', ser:'Sport', spd:6, acc:4, hdl:0, color:'red'},
    
    // ★★ Tuned
    {id:'e_2tun_1', name:'GROMLEN ★★ TUNED ENGINE', ser:'Tuned', spd:7, acc:7, hdl:0, color:'yellow'},
    {id:'e_2tun_2', name:'KESTREL ★★ TUNED ENGINE', ser:'Tuned', spd:4, acc:9, hdl:0, color:'blue'},
    {id:'e_2tun_3', name:'NORSET ★★ TUNED ENGINE', ser:'Tuned', spd:9, acc:4, hdl:0, color:'green'},
    {id:'e_2tun_4', name:'RICHTER ★★ TUNED ENGINE', ser:'Tuned', spd:7, acc:4, hdl:0, color:'red'},
    
    // ★★★ Improved
    {id:'e_3imp_1', name:'MEDION ★★★ IMPROVED ENGINE', ser:'Improved', spd:8, acc:8, hdl:0, color:'yellow'},
    {id:'e_3imp_2', name:'LIRSA MOTORSPORT ★★★ IMPROVED ENGINE', ser:'Improved', spd:9, acc:6, hdl:0, color:'green'},
    {id:'e_3imp_3', name:'VELOCICOM ★★★ IMPROVED ENGINE', ser:'Improved', spd:6, acc:9, hdl:0, color:'blue'},
    {id:'e_3imp_4', name:'VENTURA ★★★ IMPROVED ENGINE', ser:'Improved', spd:8, acc:6, hdl:0, color:'red'},
    
    // ★★★ Sport
    {id:'e_3spt_1', name:'MEDION ★★★ SPORT ENGINE', ser:'Sport', spd:9, acc:9, hdl:0, color:'yellow'},
    {id:'e_3spt_2', name:'LIRSA MOTORSPORT ★★★ SPORT ENGINE', ser:'Sport', spd:12, acc:6, hdl:0, color:'green'},
    {id:'e_3spt_3', name:'VELOCICOM ★★★ SPORT ENGINE', ser:'Sport', spd:6, acc:12, hdl:0, color:'blue'},
    {id:'e_3spt_4', name:'VENTURA ★★★ SPORT ENGINE', ser:'Sport', spd:9, acc:6, hdl:0, color:'red'},
    
    // ★★★ Tuned
    {id:'e_3tun_1', name:'MEDION ★★★ TUNED ENGINE', ser:'Tuned', spd:9, acc:9, hdl:0, color:'yellow'},
    {id:'e_3tun_2', name:'LIRSA MOTORSPORT ★★★ TUNED ENGINE', ser:'Tuned', spd:13, acc:7, hdl:0, color:'green'},
    {id:'e_3tun_3', name:'VELOCICOM ★★★ TUNED ENGINE', ser:'Tuned', spd:7, acc:13, hdl:0, color:'blue'},
    {id:'e_3tun_4', name:'VENTURA ★★★ TUNED ENGINE', ser:'Tuned', spd:9, acc:7, hdl:0, color:'red'},
    
    // ★★★★ Improved
    {id:'e_4imp_1', name:'ATTACK MOTORSPORT ★★★★ IMPROVED ENGINE', ser:'Improved', spd:11, acc:8, hdl:0, color:'red'},
    {id:'e_4imp_2', name:'SPEEDSCIENS ★★★★ IMPROVED ENGINE', ser:'Improved', spd:14, acc:8, hdl:0, color:'green'},
    {id:'e_4imp_3', name:'TRANSTEK ★★★★ IMPROVED ENGINE', ser:'Improved', spd:11, acc:11, hdl:0, color:'yellow'},
    {id:'e_4imp_4', name:'ZERO TUNING MODS ★★★★ IMPROVED ENGINE', ser:'Improved', spd:8, acc:14, hdl:0, color:'blue'},
    
    // ★★★★ Sport
    {id:'e_4spt_1', name:'ATTACK MOTORSPORT ★★★★ SPORT ENGINE', ser:'Sport', spd:12, acc:8, hdl:0, color:'red'},
    {id:'e_4spt_2', name:'SPEEDSCIENS ★★★★ SPORT ENGINE', ser:'Sport', spd:16, acc:8, hdl:0, color:'green'},
    {id:'e_4spt_3', name:'TRANSTEK ★★★★ SPORT ENGINE', ser:'Sport', spd:12, acc:12, hdl:0, color:'yellow'},
    {id:'e_4spt_4', name:'ZERO TUNING MODS ★★★★ SPORT ENGINE', ser:'Sport', spd:8, acc:16, hdl:0, color:'blue'},
    
    // ★★★★ Tuned
    {id:'e_4tun_1', name:'ATTACK MOTORSPORT ★★★★ TUNED ENGINE', ser:'Tuned', spd:13, acc:9, hdl:0, color:'red'},
    {id:'e_4tun_2', name:'SPEEDSCIENS ★★★★ TUNED ENGINE', ser:'Tuned', spd:17, acc:9, hdl:0, color:'green'},
    {id:'e_4tun_3', name:'TRANSTEK ★★★★ TUNED ENGINE', ser:'Tuned', spd:13, acc:13, hdl:0, color:'yellow'},
    {id:'e_4tun_4', name:'ZERO TUNING MODS ★★★★ TUNED ENGINE', ser:'Tuned', spd:9, acc:17, hdl:0, color:'blue'},
    
    // ★★★★★ Improved
    {id:'e_5imp_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ IMPROVED ENGINE', ser:'Improved', spd:18, acc:11, hdl:0, color:'green'},
    {id:'e_5imp_2', name:'QUARTZ SPEED PACKAGES ★★★★★ IMPROVED ENGINE', ser:'Improved', spd:14, acc:14, hdl:0, color:'yellow'},
    {id:'e_5imp_3', name:'STICK MOTORSPORT ★★★★★ IMPROVED ENGINE', ser:'Improved', spd:11, acc:18, hdl:0, color:'blue'},
    {id:'e_5imp_4', name:'TEAR ★★★★★ IMPROVED ENGINE', ser:'Improved', spd:14, acc:9, hdl:0, color:'red'},
    
    // ★★★★★ Sport
    {id:'e_5spt_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ SPORT ENGINE', ser:'Sport', spd:19, acc:12, hdl:0, color:'green'},
    {id:'e_5spt_2', name:'QUARTZ SPEED PACKAGES ★★★★★ SPORT ENGINE', ser:'Sport', spd:14, acc:14, hdl:0, color:'yellow'},
    {id:'e_5spt_3', name:'STICK MOTORSPORT ★★★★★ SPORT ENGINE', ser:'Sport', spd:12, acc:19, hdl:0, color:'blue'},
    {id:'e_5spt_4', name:'TEAR ★★★★★ SPORT ENGINE', ser:'Sport', spd:14, acc:11, hdl:0, color:'red'},
    
    // ★★★★★ Tuned
    {id:'e_5tun_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ TUNED ENGINE', ser:'Tuned', spd:22, acc:13, hdl:0, color:'green'},
    {id:'e_5tun_2', name:'QUARTZ SPEED PACKAGES ★★★★★ TUNED ENGINE', ser:'Tuned', spd:16, acc:16, hdl:0, color:'yellow'},
    {id:'e_5tun_3', name:'STICK MOTORSPORT ★★★★★ TUNED ENGINE', ser:'Tuned', spd:13, acc:22, hdl:0, color:'blue'},
    {id:'e_5tun_4', name:'TEAR ★★★★★ TUNED ENGINE', ser:'Tuned', spd:16, acc:12, hdl:0, color:'red'},
    
    // Proto
    {id:'e_proto_1', name:'NEED FOR SPEED ★★★★★ LVL49 PROTO-25 ENGINE', ser:'Proto', spd:25, acc:0, hdl:0, color:'gold'},
    {id:'e_proto_2', name:'NEED FOR SPEED ★★★★★ LVL60 PROTO-50 ENGINE', ser:'Proto', spd:50, acc:0, hdl:0, color:'gold'},
    {id:'e_proto_3', name:'NEED FOR SPEED ★★★★★ LVL60 PROTO-75 ENGINE', ser:'Proto', spd:75, acc:0, hdl:0, color:'gold'},
    {id:'e_proto_4', name:'NEED FOR SPEED ★★★★★ LVL70 PROTO-99 ENGINE', ser:'Proto', spd:99, acc:0, hdl:0, color:'gold'},
    {id:'e_proto_5', name:'NEED FOR SPEED ★★★★★ LVL70 PROTO-100 ENGINE', ser:'Proto', spd:100, acc:0, hdl:0, color:'gold'}
  ],
  
  // ========== ТУРБО (НАДУВ) ==========
  turbo: [
    // ★ Improved
    {id:'t_imp_1', name:'AMERIKAN SPEEDSYSTEM ★ IMPROVED INDUCTION', ser:'Improved', spd:1, acc:1, hdl:0, color:'yellow'},
    {id:'t_imp_2', name:'DAWNDRAFT ★ IMPROVED INDUCTION', ser:'Improved', spd:1, acc:2, hdl:0, color:'blue'},
    {id:'t_imp_3', name:'NDVA-T ★ IMPROVED INDUCTION', ser:'Improved', spd:0, acc:1, hdl:0, color:'red'},
    {id:'t_imp_4', name:'OMNIA RACEGRUPPE ★ IMPROVED INDUCTION', ser:'Improved', spd:2, acc:1, hdl:0, color:'green'},
    
    // ★ Sport
    {id:'t_spt_1', name:'AMERIKAN SPEEDSYSTEM ★ SPORT INDUCTION', ser:'Sport', spd:2, acc:2, hdl:0, color:'yellow'},
    {id:'t_spt_2', name:'DAWNDRAFT ★ SPORT INDUCTION', ser:'Sport', spd:2, acc:3, hdl:0, color:'blue'},
    {id:'t_spt_3', name:'NDVA-T ★ SPORT INDUCTION', ser:'Sport', spd:1, acc:2, hdl:0, color:'red'},
    {id:'t_spt_4', name:'OMNIA RACEGRUPPE ★ SPORT INDUCTION', ser:'Sport', spd:3, acc:2, hdl:0, color:'green'},
    
    // ★ Tuned
    {id:'t_tun_1', name:'AMERIKAN SPEEDSYSTEM ★ TUNED INDUCTION', ser:'Tuned', spd:3, acc:3, hdl:0, color:'yellow'},
    {id:'t_tun_2', name:'DAWNDRAFT ★ TUNED INDUCTION', ser:'Tuned', spd:3, acc:4, hdl:0, color:'blue'},
    {id:'t_tun_3', name:'NDVA-T ★ TUNED INDUCTION', ser:'Tuned', spd:2, acc:3, hdl:0, color:'red'},
    
    // ★★ Improved
    {id:'t_2imp_1', name:'GROMLEN ★★ IMPROVED INDUCTION', ser:'Improved', spd:4, acc:4, hdl:0, color:'green'},
    {id:'t_2imp_2', name:'KESTREL ★★ IMPROVED INDUCTION', ser:'Improved', spd:4, acc:4, hdl:0, color:'yellow'},
    {id:'t_2imp_3', name:'NORSET ★★ IMPROVED INDUCTION', ser:'Improved', spd:4, acc:4, hdl:0, color:'blue'},
    {id:'t_2imp_4', name:'RICHTER ★★ IMPROVED INDUCTION', ser:'Improved', spd:2, acc:4, hdl:0, color:'red'},
    
    // ★★ Sport
    {id:'t_2spt_1', name:'GROMLEN ★★ SPORT INDUCTION', ser:'Sport', spd:4, acc:4, hdl:0, color:'green'},
    {id:'t_2spt_2', name:'KESTREL ★★ SPORT INDUCTION', ser:'Sport', spd:4, acc:6, hdl:0, color:'yellow'},
    {id:'t_2spt_3', name:'NORSET ★★ SPORT INDUCTION', ser:'Sport', spd:6, acc:4, hdl:0, color:'blue'},
    {id:'t_2spt_4', name:'RICHTER ★★ SPORT INDUCTION', ser:'Sport', spd:3, acc:4, hdl:0, color:'red'},
    
    // ★★ Tuned
    {id:'t_2tun_1', name:'GROMLEN ★★ TUNED INDUCTION', ser:'Tuned', spd:4, acc:4, hdl:0, color:'green'},
    {id:'t_2tun_2', name:'KESTREL ★★ TUNED INDUCTION', ser:'Tuned', spd:4, acc:7, hdl:0, color:'yellow'},
    {id:'t_2tun_3', name:'NORSET ★★ TUNED INDUCTION', ser:'Tuned', spd:7, acc:4, hdl:0, color:'blue'},
    {id:'t_2tun_4', name:'RICHTER ★★ TUNED INDUCTION', ser:'Tuned', spd:3, acc:4, hdl:0, color:'red'},
    
    // ★★★ Improved
    {id:'t_3imp_1', name:'MEDION ★★★ IMPROVED INDUCTION', ser:'Improved', spd:6, acc:6, hdl:0, color:'green'},
    {id:'t_3imp_2', name:'URSA MOTORSPORT ★★★ IMPROVED INDUCTION', ser:'Improved', spd:8, acc:6, hdl:0, color:'yellow'},
    {id:'t_3imp_3', name:'VELOCICOM ★★★ IMPROVED INDUCTION', ser:'Improved', spd:6, acc:8, hdl:0, color:'blue'},
    {id:'t_3imp_4', name:'VENTURA ★★★ IMPROVED INDUCTION', ser:'Improved', spd:3, acc:6, hdl:0, color:'red'},
    
    // ★★★ Sport
    {id:'t_3spt_1', name:'MEDION ★★★ SPORT INDUCTION', ser:'Sport', spd:6, acc:6, hdl:0, color:'green'},
    {id:'t_3spt_2', name:'URSA MOTORSPORT ★★★ SPORT INDUCTION', ser:'Sport', spd:9, acc:6, hdl:0, color:'yellow'},
    {id:'t_3spt_3', name:'VELOCICOM ★★★ SPORT INDUCTION', ser:'Sport', spd:6, acc:9, hdl:0, color:'blue'},
    {id:'t_3spt_4', name:'VENTURA ★★★ SPORT INDUCTION', ser:'Sport', spd:4, acc:6, hdl:0, color:'red'},
    
    // ★★★ Tuned
    {id:'t_3tun_1', name:'MEDION ★★★ TUNED INDUCTION', ser:'Tuned', spd:7, acc:7, hdl:0, color:'green'},
    {id:'t_3tun_2', name:'URSA MOTORSPORT ★★★ TUNED INDUCTION', ser:'Tuned', spd:9, acc:7, hdl:0, color:'yellow'},
    {id:'t_3tun_3', name:'VELOCICOM ★★★ TUNED INDUCTION', ser:'Tuned', spd:7, acc:9, hdl:0, color:'blue'},
    {id:'t_3tun_4', name:'VENTURA ★★★ TUNED INDUCTION', ser:'Tuned', spd:4, acc:7, hdl:0, color:'red'},
    
    // ★★★★ Improved
    {id:'t_4imp_1', name:'ATTACK MOTORSPORT ★★★★ IMPROVED INDUCTION', ser:'Improved', spd:4, acc:8, hdl:0, color:'green'},
    {id:'t_4imp_2', name:'SPEEDSCIENS ★★★★ IMPROVED INDUCTION', ser:'Improved', spd:11, acc:8, hdl:0, color:'yellow'},
    {id:'t_4imp_3', name:'TRANSTEK ★★★★ IMPROVED INDUCTION', ser:'Improved', spd:8, acc:8, hdl:0, color:'blue'},
    {id:'t_4imp_4', name:'ZERO TUNING MODS ★★★★ IMPROVED INDUCTION', ser:'Improved', spd:8, acc:11, hdl:0, color:'red'},
    
    // ★★★★ Sport
    {id:'t_4spt_1', name:'ATTACK MOTORSPORT ★★★★ SPORT INDUCTION', ser:'Sport', spd:4, acc:8, hdl:0, color:'green'},
    {id:'t_4spt_2', name:'SPEEDSCIENS ★★★★ SPORT INDUCTION', ser:'Sport', spd:12, acc:8, hdl:0, color:'yellow'},
    {id:'t_4spt_3', name:'TRANSTEK ★★★★ SPORT INDUCTION', ser:'Sport', spd:8, acc:8, hdl:0, color:'blue'},
    {id:'t_4spt_4', name:'ZERO TUNING MODS ★★★★ SPORT INDUCTION', ser:'Sport', spd:8, acc:12, hdl:0, color:'red'},
    
    // ★★★★ Tuned
    {id:'t_4tun_1', name:'ATTACK MOTORSPORT ★★★★ TUNED INDUCTION', ser:'Tuned', spd:4, acc:9, hdl:0, color:'green'},
    {id:'t_4tun_2', name:'SPEEDSCIENS ★★★★ TUNED INDUCTION', ser:'Tuned', spd:13, acc:9, hdl:0, color:'yellow'},
    {id:'t_4tun_3', name:'TRANSTECK ★★★★ TUNED INDUCTION', ser:'Tuned', spd:9, acc:9, hdl:0, color:'blue'},
    {id:'t_4tun_4', name:'ZERO TUNING MODS ★★★★ TUNED INDUCTION', ser:'Tuned', spd:9, acc:13, hdl:0, color:'red'},
    
    // ★★★★★ Improved
    {id:'t_5imp_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ IMPROVED INDUCTION', ser:'Improved', spd:14, acc:9, hdl:0, color:'green'},
    {id:'t_5imp_2', name:'QUARTZ SPEED PACKAGES ★★★★★ IMPROVED INDUCTION', ser:'Improved', spd:9, acc:9, hdl:0, color:'yellow'},
    {id:'t_5imp_3', name:'STICK MOTORSPORT ★★★★★ IMPROVED INDUCTION', ser:'Improved', spd:9, acc:14, hdl:0, color:'blue'},
    {id:'t_5imp_4', name:'TEAR ★★★★★ IMPROVED INDUCTION', ser:'Improved', spd:6, acc:9, hdl:0, color:'red'},
    
    // ★★★★★ Sport
    {id:'t_5spt_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ SPORT INDUCTION', ser:'Sport', spd:14, acc:11, hdl:0, color:'green'},
    {id:'t_5spt_2', name:'QUARTZ SPEED PACKAGES ★★★★★ SPORT INDUCTION', ser:'Sport', spd:11, acc:11, hdl:0, color:'yellow'},
    {id:'t_5spt_3', name:'STICK MOTORSPORT ★★★★★ SPORT INDUCTION', ser:'Sport', spd:11, acc:14, hdl:0, color:'blue'},
    {id:'t_5spt_4', name:'TEAR ★★★★★ SPORT INDUCTION', ser:'Sport', spd:7, acc:11, hdl:0, color:'red'},
    
    // ★★★★★ Tuned
    {id:'t_5tun_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ TUNED INDUCTION', ser:'Tuned', spd:16, acc:12, hdl:0, color:'green'},
    {id:'t_5tun_2', name:'QUARTZ SPEED PACKAGES ★★★★★ TUNED INDUCTION', ser:'Tuned', spd:12, acc:12, hdl:0, color:'yellow'},
    {id:'t_5tun_3', name:'STICK MOTORSPORT ★★★★★ TUNED INDUCTION', ser:'Tuned', spd:12, acc:16, hdl:0, color:'blue'},
    {id:'t_5tun_4', name:'TEAR ★★★★★ TUNED INDUCTION', ser:'Tuned', spd:8, acc:11, hdl:0, color:'red'},
    
    // Proto
    {id:'t_proto_1', name:'NEED FOR SPEED ★★★★★ LVL49 PROTO-25 INDUCTION', ser:'Proto', spd:0, acc:25, hdl:0, color:'green'},
    {id:'t_proto_2', name:'NEED FOR SPEED ★★★★★ LVL60 PROTO-50 INDUCTION', ser:'Proto', spd:0, acc:55, hdl:0, color:'gold'},
    {id:'t_proto_3', name:'NEED FOR SPEED ★★★★★ LVL60 PROTO-75 INDUCTION', ser:'Proto', spd:0, acc:75, hdl:0, color:'gold'},
    {id:'t_proto_4', name:'NEED FOR SPEED ★★★★★ LVL70 PROTO-99 INDUCTION', ser:'Proto', spd:0, acc:99, hdl:0, color:'gold'},
    {id:'t_proto_5', name:'NEED FOR SPEED ★★★★★ LVL70 PROTO-100 INDUCTION', ser:'Proto', spd:0, acc:100, hdl:0, color:'gold'}
  ],
  
  // ========== ПОДВЕСКА ==========
  suspension: [
    // ★ Improved
    {id:'s_imp_1', name:'AMERIKAN SPEEDSYSTEM ★ IMPROVED SUSPENSION', ser:'Improved', spd:0, acc:0, hdl:2, color:'yellow'},
    {id:'s_imp_2', name:'DAWWNDRAFT ★ IMPROVED SUSPENSION', ser:'Improved', spd:0, acc:1, hdl:2, color:'blue'},
    {id:'s_imp_3', name:'NOVA-T ★ IMPROVED SUSPENSION', ser:'Improved', spd:0, acc:1, hdl:3, color:'red'},
    {id:'s_imp_4', name:'OMNIA RACEGRUPPE ★ IMPROVED SUSPENSION', ser:'Improved', spd:1, acc:0, hdl:2, color:'green'},
    
    // ★ Sport
    {id:'s_spt_1', name:'AMERIKAN SPEEDSYSTEM ★ SPORT SUSPENSION', ser:'Sport', spd:1, acc:1, hdl:3, color:'yellow'},
    {id:'s_spt_2', name:'DAWNDRAFT ★ SPORT SUSPENSION', ser:'Sport', spd:1, acc:2, hdl:3, color:'blue'},
    {id:'s_spt_3', name:'NOVA-T ★ SPORT SUSPENSION', ser:'Sport', spd:1, acc:2, hdl:4, color:'red'},
    {id:'s_spt_4', name:'OMNIA RACEGRUPPE ★ SPORT SUSPENSION', ser:'Sport', spd:2, acc:1, hdl:3, color:'green'},
    
    // ★ Tuned
    {id:'s_tun_1', name:'AMERIKON SPEEDSYSTEMS ★ TUNED SUSPENSION', ser:'Tuned', spd:2, acc:2, hdl:4, color:'yellow'},
    {id:'s_tun_2', name:'DAWNDRAFT ★ TUNED SUSPENSION', ser:'Tuned', spd:2, acc:3, hdl:4, color:'blue'},
    {id:'s_tun_3', name:'NOVA-T ★ TUNED SUSPENSION', ser:'Tuned', spd:2, acc:3, hdl:4, color:'red'},
    {id:'s_tun_4', name:'OMNIA RACEGRUPPE ★ TUNED SUSPENSION', ser:'Tuned', spd:3, acc:2, hdl:4, color:'green'},
    
    // ★★ Improved
    {id:'s_2imp_1', name:'GROMLEN ★★ IMPROVED SUSPENSION', ser:'Improved', spd:2, acc:2, hdl:4, color:'yellow'},
    {id:'s_2imp_2', name:'KESTREL ★★ IMPROVED SUSPENSION', ser:'Improved', spd:2, acc:4, hdl:4, color:'blue'},
    {id:'s_2imp_3', name:'NORSET ★★ IMPROVED SUSPENSION', ser:'Improved', spd:4, acc:2, hdl:4, color:'green'},
    {id:'s_2imp_4', name:'RICHTER ★★ IMPROVED SUSPENSION', ser:'Improved', spd:2, acc:4, hdl:6, color:'red'},
    
    // ★★ Sport
    {id:'s_2spt_1', name:'GROMLEN ★★ SPORT SUSPENSION', ser:'Sport', spd:3, acc:3, hdl:6, color:'yellow'},
    {id:'s_2spt_2', name:'KESTREL ★★ SPORT SUSPENSION', ser:'Sport', spd:3, acc:4, hdl:6, color:'blue'},
    {id:'s_2spt_3', name:'NORSET ★★ SPORT SUSPENSION', ser:'Sport', spd:4, acc:3, hdl:6, color:'green'},
    {id:'s_2spt_4', name:'RICHTER ★★ SPORT SUSPENSION', ser:'Sport', spd:3, acc:4, hdl:8, color:'red'},
    
    // ★★ Tuned
    {id:'s_2tun_1', name:'GROMLEN ★★ TUNED SUSPENSION', ser:'Tuned', spd:3, acc:3, hdl:7, color:'yellow'},
    {id:'s_2tun_2', name:'KESTREL ★★ TUNED SUSPENSION', ser:'Tuned', spd:3, acc:4, hdl:7, color:'blue'},
    {id:'s_2tun_3', name:'NORSET ★★ TUNED SUSPENSION', ser:'Tuned', spd:4, acc:3, hdl:7, color:'green'},
    {id:'s_2tun_4', name:'RICHTER ★★ TUNED SUSPENSION', ser:'Tuned', spd:3, acc:4, hdl:9, color:'red'},
    
    // ★★★ Improved
    {id:'s_3imp_1', name:'MEDION ★★★ IMPROVED SUSPENSION', ser:'Improved', spd:3, acc:3, hdl:8, color:'yellow'},
    {id:'s_3imp_2', name:'LIRSA MOTORSPORT ★★★ IMPROVED SUSPENSION', ser:'Improved', spd:6, acc:3, hdl:8, color:'green'},
    {id:'s_3imp_3', name:'VELOCICOM ★★★ IMPROVED SUSPENSION', ser:'Improved', spd:3, acc:6, hdl:8, color:'blue'},
    {id:'s_3imp_4', name:'VENTURA ★★★ IMPROVED SUSPENSION', ser:'Improved', spd:3, acc:6, hdl:9, color:'red'},
    
    // ★★★ Sport
    {id:'s_3spt_1', name:'MEDION ★★★ SPORT SUSPENSION', ser:'Sport', spd:4, acc:4, hdl:9, color:'yellow'},
    {id:'s_3spt_2', name:'LIRSA MOTORSPORT ★★★ SPORT SUSPENSION', ser:'Sport', spd:6, acc:4, hdl:9, color:'green'},
    {id:'s_3spt_3', name:'VELOCICOM ★★★ SPORT SUSPENSION', ser:'Sport', spd:4, acc:6, hdl:9, color:'blue'},
    {id:'s_3spt_4', name:'VENTURA ★★★ SPORT SUSPENSION', ser:'Sport', spd:4, acc:6, hdl:12, color:'red'},
    
    // ★★★ Tuned
    {id:'s_3tun_1', name:'MEDION ★★★ TUNED SUSPENSION', ser:'Tuned', spd:4, acc:4, hdl:9, color:'yellow'},
    {id:'s_3tun_2', name:'LIRSA MOTORSPORT ★★★ TUNED SUSPENSION', ser:'Tuned', spd:7, acc:4, hdl:9, color:'green'},
    {id:'s_3tun_3', name:'VELOCICOM ★★★ TUNED SUSPENSION', ser:'Tuned', spd:4, acc:7, hdl:9, color:'blue'},
    {id:'s_3tun_4', name:'VENTURA ★★★ TUNED SUSPENSION', ser:'Tuned', spd:4, acc:7, hdl:13, color:'red'},
    
    // ★★★★ Improved
    {id:'s_4imp_1', name:'ATTACK MOTORSPORT ★★★★ IMPROVED SUSPENSION', ser:'Improved', spd:4, acc:8, hdl:14, color:'red'},
    {id:'s_4imp_2', name:'SPEEDSCIENS ★★★★ IMPROVED SUSPENSION', ser:'Improved', spd:8, acc:4, hdl:11, color:'green'},
    {id:'s_4imp_3', name:'TRANSTEK ★★★★ IMPROVED SUSPENSION', ser:'Improved', spd:4, acc:4, hdl:11, color:'yellow'},
    {id:'s_4imp_4', name:'ZERO TUNING MODS ★★★★ IMPROVED SUSPENSION', ser:'Improved', spd:4, acc:8, hdl:11, color:'blue'},
    
    // ★★★★ Sport
    {id:'s_4spt_1', name:'ATTACK MOTORSPORT ★★★★ SPORT SUSPENSION', ser:'Sport', spd:4, acc:8, hdl:16, color:'red'},
    {id:'s_4spt_2', name:'SPEEDSCIENS ★★★★ SPORT SUSPENSION', ser:'Sport', spd:8, acc:4, hdl:12, color:'green'},
    {id:'s_4spt_3', name:'TRANSTEK ★★★★ SPORT SUSPENSION', ser:'Sport', spd:4, acc:4, hdl:12, color:'yellow'},
    {id:'s_4spt_4', name:'ZERO TUNING MODS ★★★★ SPORT SUSPENSION', ser:'Sport', spd:4, acc:8, hdl:12, color:'blue'},
    
    // ★★★★ Tuned
    {id:'s_4tun_1', name:'ATTACK MOTORSPORT ★★★★ TUNED SUSPENSION', ser:'Tuned', spd:4, acc:9, hdl:17, color:'red'},
    {id:'s_4tun_2', name:'SPEEDSCIENS ★★★★ TUNED SUSPENSION', ser:'Tuned', spd:9, acc:4, hdl:13, color:'green'},
    {id:'s_4tun_3', name:'TRANSTEK ★★★★ TUNED SUSPENSION', ser:'Tuned', spd:4, acc:4, hdl:13, color:'yellow'},
    {id:'s_4tun_4', name:'ZERO TUNING MODS ★★★★ TUNED SUSPENSION', ser:'Tuned', spd:4, acc:9, hdl:13, color:'blue'},
    
    // ★★★★★ Improved
    {id:'s_5imp_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ IMPROVED SUSPENSION', ser:'Improved', spd:14, acc:6, hdl:9, color:'green'},
    {id:'s_5imp_2', name:'QUARTZ SPEED PACKAGES ★★★★★ IMPROVED SUSPENSION', ser:'Improved', spd:6, acc:4, hdl:14, color:'black'},
    {id:'s_5imp_3', name:'STICK MOTORSPORT ★★★★★ IMPROVED SUSPENSION', ser:'Improved', spd:6, acc:9, hdl:14, color:'blue'},
    {id:'s_5imp_4', name:'TEAR ★★★★★ IMPROVED SUSPENSION', ser:'Improved', spd:6, acc:9, hdl:18, color:'red'},
    
    // ★★★★★ Sport
    {id:'s_5spt_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ SPORT SUSPENSION', ser:'Sport', spd:14, acc:7, hdl:9, color:'green'},
    {id:'s_5spt_2', name:'QUARTZ SPEED PACKAGES ★★★★★ SPORT SUSPENSION', ser:'Sport', spd:7, acc:6, hdl:14, color:'black'},
    {id:'s_5spt_3', name:'STICK MOTORSPORT ★★★★★ SPORT SUSPENSION', ser:'Sport', spd:7, acc:9, hdl:14, color:'blue'},
    {id:'s_5spt_4', name:'TEAR ★★★★★ SPORT SUSPENSION', ser:'Sport', spd:6, acc:9, hdl:19, color:'red'},
    
    // ★★★★★ Tuned
    {id:'s_5tun_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ TUNED SUSPENSION', ser:'Tuned', spd:14, acc:7, hdl:11, color:'green'},
    {id:'s_5tun_2', name:'QUARTZ SPEED PACKAGES ★★★★★ TUNED SUSPENSION', ser:'Tuned', spd:7, acc:7, hdl:14, color:'black'},
    {id:'s_5tun_3', name:'STICK MOTORSPORT ★★★★★ TUNED SUSPENSION', ser:'Tuned', spd:7, acc:11, hdl:14, color:'blue'},
    {id:'s_5tun_4', name:'TEAR ★★★★★ TUNED SUSPENSION', ser:'Tuned', spd:7, acc:9, hdl:22, color:'red'}
  ],
  
  // ========== ТОРМОЗА ==========
  brakes: [
    // ★ Improved
    {id:'b_imp_1', name:'AMERIKAN SPEEDSYSTEM ★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:2, color:'yellow'},
    {id:'b_imp_2', name:'DAWWNDRAFT ★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:1, color:'blue'},
    {id:'b_imp_3', name:'NOVA-T ★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:3, color:'red'},
    {id:'b_imp_4', name:'OMNIA RACEGRUPPE ★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:1, color:'green'},
    
    // ★ Sport
    {id:'b_spt_1', name:'AMERIKAN SPEEDSYSTEM ★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:3, color:'yellow'},
    {id:'b_spt_2', name:'DAWNDRAFT ★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:2, color:'blue'},
    {id:'b_spt_3', name:'NOVA-T ★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:4, color:'red'},
    {id:'b_spt_4', name:'OMNIA RACEGRUPPE ★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:2, color:'green'},
    
    // ★ Tuned
    {id:'b_tun_1', name:'AMERIKON SPEEDSYSTEMS ★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:4, color:'yellow'},
    {id:'b_tun_2', name:'DAWNDRAFT ★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:3, color:'blue'},
    {id:'b_tun_3', name:'NOVA-T ★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:4, color:'red'},
    {id:'b_tun_4', name:'OMNIA RACEGRUPPE ★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:3, color:'green'},
    
    // ★★ Improved
    {id:'b_2imp_1', name:'GROMLEN ★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:4, color:'yellow'},
    {id:'b_2imp_2', name:'KESTREL ★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:4, color:'blue'},
    {id:'b_2imp_3', name:'NORSET ★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:4, color:'green'},
    {id:'b_2imp_4', name:'RICHTER ★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:6, color:'red'},
    
    // ★★ Sport
    {id:'b_2spt_1', name:'GROMLEN ★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:6, color:'yellow'},
    {id:'b_2spt_2', name:'KESTREL ★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:4, color:'blue'},
    {id:'b_2spt_3', name:'NORSET ★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:4, color:'green'},
    {id:'b_2spt_4', name:'RICHTER ★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:8, color:'red'},
    
    // ★★ Tuned
    {id:'b_2tun_1', name:'GROMLEN ★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:7, color:'yellow'},
    {id:'b_2tun_2', name:'KESTREL ★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:4, color:'blue'},
    {id:'b_2tun_3', name:'NORSET ★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:4, color:'green'},
    {id:'b_2tun_4', name:'RICHTER ★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:9, color:'red'},
    
    // ★★★ Improved
    {id:'b_3imp_1', name:'MEDION ★★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:8, color:'yellow'},
    {id:'b_3imp_2', name:'LIRSA MOTORSPORT ★★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:6, color:'green'},
    {id:'b_3imp_3', name:'VELOCICOM ★★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:6, color:'blue'},
    {id:'b_3imp_4', name:'VENTURA ★★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:9, color:'red'},
    
    // ★★★ Sport
    {id:'b_3spt_1', name:'MEDION ★★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:9, color:'yellow'},
    {id:'b_3spt_2', name:'LIRSA MOTORSPORT ★★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:6, color:'green'},
    {id:'b_3spt_3', name:'VELOCICOM ★★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:6, color:'blue'},
    {id:'b_3spt_4', name:'VENTURA ★★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:12, color:'red'},
    
    // ★★★ Tuned
    {id:'b_3tun_1', name:'MEDION ★★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:9, color:'yellow'},
    {id:'b_3tun_2', name:'LIRSA MOTORSPORT ★★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:7, color:'green'},
    {id:'b_3tun_3', name:'VELOCICOM ★★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:7, color:'blue'},
    {id:'b_3tun_4', name:'VENTURA ★★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:13, color:'red'},
    
    // ★★★★ Improved
    {id:'b_4imp_1', name:'ATTACK MOTORSPORT ★★★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:14, color:'red'},
    {id:'b_4imp_2', name:'SPEEDSCIENS ★★★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:8, color:'green'},
    {id:'b_4imp_3', name:'TRANSTEK ★★★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:11, color:'yellow'},
    {id:'b_4imp_4', name:'ZERO TUNING MODS ★★★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:8, color:'blue'},
    
    // ★★★★ Sport
    {id:'b_4spt_1', name:'ATTACK MOTORSPORT ★★★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:16, color:'red'},
    {id:'b_4spt_2', name:'SPEEDSCIENS ★★★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:8, color:'green'},
    {id:'b_4spt_3', name:'TRANSTEK ★★★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:12, color:'yellow'},
    {id:'b_4spt_4', name:'ZERO TUNING MODS ★★★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:8, color:'blue'},
    
    // ★★★★ Tuned
    {id:'b_4tun_1', name:'ATTACK MOTORSPORT ★★★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:17, color:'red'},
    {id:'b_4tun_2', name:'SPEEDSCIENS ★★★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:9, color:'green'},
    {id:'b_4tun_3', name:'TRANSTEK ★★★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:13, color:'yellow'},
    {id:'b_4tun_4', name:'ZERO TUNING MODS ★★★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:9, color:'blue'},
    
    // ★★★★★ Improved
    {id:'b_5imp_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:9, color:'green'},
    {id:'b_5imp_2', name:'QUARTZ SPEED PACKAGES ★★★★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:14, color:'yellow'},
    {id:'b_5imp_3', name:'STICK MOTORSPORT ★★★★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:9, color:'blue'},
    {id:'b_5imp_4', name:'TEAR ★★★★★ IMPROVED BRAKES', ser:'Improved', spd:0, acc:0, hdl:18, color:'red'},
    
    // ★★★★★ Sport
    {id:'b_5spt_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:11, color:'green'},
    {id:'b_5spt_2', name:'QUARTZ SPEED PACKAGES ★★★★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:14, color:'yellow'},
    {id:'b_5spt_3', name:'STICK MOTORSPORT ★★★★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:11, color:'blue'},
    {id:'b_5spt_4', name:'TEAR ★★★★★ SPORT BRAKES', ser:'Sport', spd:0, acc:0, hdl:19, color:'red'},
    
    // ★★★★★ Tuned
    {id:'b_5tun_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:12, color:'green'},
    {id:'b_5tun_2', name:'QUARTZ SPEED PACKAGES ★★★★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:16, color:'yellow'},
    {id:'b_5tun_3', name:'STICK MOTORSPORT ★★★★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:12, color:'blue'},
    {id:'b_5tun_4', name:'TEAR ★★★★★ TUNED BRAKES', ser:'Tuned', spd:0, acc:0, hdl:22, color:'red'},
    
    // Proto
    {id:'b_proto_1', name:'NEED FOR SPEED ★★★★★ LVL49 PROTO-25 BRAKES', ser:'Proto', spd:0, acc:0, hdl:25, color:'gold'},
    {id:'b_proto_2', name:'NEED FOR SPEED ★★★★★ LVL60 PROTO-50 BRAKES', ser:'Proto', spd:0, acc:0, hdl:50, color:'gold'},
    {id:'b_proto_3', name:'NEED FOR SPEED ★★★★★ LVL60 PROTO-75 BRAKES', ser:'Proto', spd:0, acc:0, hdl:75, color:'gold'},
    {id:'b_proto_4', name:'NEED FOR SPEED ★★★★★ LVL70 PROTO-99 BRAKES', ser:'Proto', spd:0, acc:0, hdl:98, color:'gold'},
    {id:'b_proto_5', name:'NEED FOR SPEED ★★★★★ LVL70 PROTO-100 BRAKES', ser:'Proto', spd:0, acc:0, hdl:100, color:'gold'}
  ],
  
  // ========== ШИНЫ ==========
  tires: [
    // ★ Improved
    {id:'r_imp_1', name:'AMERIKAN SPEEDSYSTEM ★ IMPROVED TIRES', ser:'Improved', spd:0, acc:1, hdl:2, color:'yellow'},
    {id:'r_imp_2', name:'DAWWNDRAFT ★ IMPROVED TIRES', ser:'Improved', spd:0, acc:1, hdl:1, color:'blue'},
    {id:'r_imp_3', name:'NOVA-T ★ IMPROVED TIRES', ser:'Improved', spd:0, acc:0, hdl:3, color:'red'},
    {id:'r_imp_4', name:'OMNIA RACEGRUPPE ★ IMPROVED TIRES', ser:'Improved', spd:0, acc:0, hdl:1, color:'green'},
    
    // ★ Sport
    {id:'r_spt_1', name:'AMERIKAN SPEEDSYSTEM ★ SPORT TIRES', ser:'Sport', spd:1, acc:2, hdl:3, color:'yellow'},
    {id:'r_spt_2', name:'DAWNDRAFT ★ SPORT TIRES', ser:'Sport', spd:1, acc:2, hdl:2, color:'blue'},
    {id:'r_spt_3', name:'NOVA-T ★ SPORT TIRES', ser:'Sport', spd:1, acc:1, hdl:4, color:'red'},
    {id:'r_spt_4', name:'OMNIA RACEGRUPPE ★ SPORT TIRES', ser:'Sport', spd:1, acc:1, hdl:2, color:'green'},
    
    // ★ Tuned
    {id:'r_tun_1', name:'AMERIKON SPEEDSYSTEMS ★ TUNED TIRES', ser:'Tuned', spd:2, acc:3, hdl:4, color:'yellow'},
    {id:'r_tun_2', name:'DAWNDRAFT ★ TUNED TIRES', ser:'Tuned', spd:2, acc:3, hdl:3, color:'blue'},
    {id:'r_tun_3', name:'NOVA-T ★ TUNED TIRES', ser:'Tuned', spd:2, acc:2, hdl:4, color:'red'},
    {id:'r_tun_4', name:'OMNIA RACEGRUPPE ★ TUNED TIRES', ser:'Tuned', spd:2, acc:2, hdl:3, color:'green'},
    
    // ★★ Improved
    {id:'r_2imp_1', name:'GROMLEN ★★ IMPROVED TIRES', ser:'Improved', spd:2, acc:4, hdl:4, color:'yellow'},
    {id:'r_2imp_2', name:'KESTREL ★★ IMPROVED TIRES', ser:'Improved', spd:2, acc:4, hdl:4, color:'blue'},
    {id:'r_2imp_3', name:'NORSET ★★ IMPROVED TIRES', ser:'Improved', spd:2, acc:2, hdl:4, color:'green'},
    {id:'r_2imp_4', name:'RICHTER ★★ IMPROVED TIRES', ser:'Improved', spd:2, acc:2, hdl:6, color:'red'},
    
    // ★★ Sport
    {id:'r_2spt_1', name:'GROMLEN ★★ SPORT TIRES', ser:'Sport', spd:2, acc:4, hdl:6, color:'yellow'},
    {id:'r_2spt_2', name:'KESTREL ★★ SPORT TIRES', ser:'Sport', spd:3, acc:4, hdl:4, color:'blue'},
    {id:'r_2spt_3', name:'NORSET ★★ SPORT TIRES', ser:'Sport', spd:3, acc:3, hdl:4, color:'green'},
    {id:'r_2spt_4', name:'RICHTER ★★ SPORT TIRES', ser:'Sport', spd:3, acc:3, hdl:8, color:'red'},
    
    // ★★ Tuned
    {id:'r_2tun_1', name:'GROMLEN ★★ TUNED TIRES', ser:'Tuned', spd:3, acc:4, hdl:7, color:'yellow'},
    {id:'r_2tun_2', name:'KESTREL ★★ TUNED TIRES', ser:'Tuned', spd:3, acc:4, hdl:4, color:'blue'},
    {id:'r_2tun_3', name:'NORSET ★★ TUNED TIRES', ser:'Tuned', spd:3, acc:3, hdl:4, color:'green'},
    {id:'r_2tun_4', name:'RICHTER ★★ TUNED TIRES', ser:'Tuned', spd:3, acc:3, hdl:9, color:'red'},
    
    // ★★★ Improved
    {id:'r_3imp_1', name:'MEDION ★★★ IMPROVED TIRES', ser:'Improved', spd:3, acc:6, hdl:8, color:'yellow'},
    {id:'r_3imp_2', name:'LIRSA MOTORSPORT ★★★ IMPROVED TIRES', ser:'Improved', spd:3, acc:3, hdl:6, color:'green'},
    {id:'r_3imp_3', name:'VELOCICOM ★★★ IMPROVED TIRES', ser:'Improved', spd:3, acc:6, hdl:6, color:'blue'},
    {id:'r_3imp_4', name:'VENTURA ★★★ IMPROVED TIRES', ser:'Improved', spd:3, acc:3, hdl:9, color:'red'},
    
    // ★★★ Sport
    {id:'r_3spt_1', name:'MEDION ★★★ SPORT TIRES', ser:'Sport', spd:4, acc:6, hdl:9, color:'yellow'},
    {id:'r_3spt_2', name:'LIRSA MOTORSPORT ★★★ SPORT TIRES', ser:'Sport', spd:4, acc:4, hdl:6, color:'green'},
    {id:'r_3spt_3', name:'VELOCICOM ★★★ SPORT TIRES', ser:'Sport', spd:4, acc:6, hdl:6, color:'blue'},
    {id:'r_3spt_4', name:'VENTURA ★★★ SPORT TIRES', ser:'Sport', spd:4, acc:4, hdl:12, color:'red'},
    
    // ★★★ Tuned
    {id:'r_3tun_1', name:'MEDION ★★★ TUNED TIRES', ser:'Tuned', spd:4, acc:7, hdl:9, color:'yellow'},
    {id:'r_3tun_2', name:'LIRSA MOTORSPORT ★★★ TUNED TIRES', ser:'Tuned', spd:4, acc:4, hdl:7, color:'green'},
    {id:'r_3tun_3', name:'VELOCICOM ★★★ TUNED TIRES', ser:'Tuned', spd:4, acc:7, hdl:7, color:'blue'},
    {id:'r_3tun_4', name:'VENTURA ★★★ TUNED TIRES', ser:'Tuned', spd:4, acc:4, hdl:13, color:'red'},
    
    // ★★★★ Improved
    {id:'r_4imp_1', name:'ATTACK MOTORSPORT ★★★★ IMPROVED TIRES', ser:'Improved', spd:4, acc:4, hdl:14, color:'red'},
    {id:'r_4imp_2', name:'SPEEDSCIENS ★★★★ IMPROVED TIRES', ser:'Improved', spd:4, acc:4, hdl:8, color:'green'},
    {id:'r_4imp_3', name:'TRANSTEK ★★★★ IMPROVED TIRES', ser:'Improved', spd:4, acc:8, hdl:11, color:'yellow'},
    {id:'r_4imp_4', name:'ZERO TUNING MODS ★★★★ IMPROVED TIRES', ser:'Improved', spd:4, acc:8, hdl:8, color:'blue'},
    
    // ★★★★ Sport
    {id:'r_4spt_1', name:'ATTACK MOTORSPORT ★★★★ SPORT TIRES', ser:'Sport', spd:4, acc:4, hdl:16, color:'red'},
    {id:'r_4spt_2', name:'SPEEDSCIENS ★★★★ SPORT TIRES', ser:'Sport', spd:4, acc:4, hdl:8, color:'green'},
    {id:'r_4spt_3', name:'TRANSTEK ★★★★ SPORT TIRES', ser:'Sport', spd:4, acc:8, hdl:12, color:'yellow'},
    {id:'r_4spt_4', name:'ZERO TUNING MODS ★★★★ SPORT TIRES', ser:'Sport', spd:4, acc:8, hdl:8, color:'blue'},
    
    // ★★★★ Tuned
    {id:'r_4tun_1', name:'ATTACK MOTORSPORT ★★★★ TUNED TIRES', ser:'Tuned', spd:4, acc:4, hdl:17, color:'red'},
    {id:'r_4tun_2', name:'SPEEDSCIENS ★★★★ TUNED TIRES', ser:'Tuned', spd:4, acc:4, hdl:9, color:'green'},
    {id:'r_4tun_3', name:'TRANSTEK ★★★★ TUNED TIRES', ser:'Tuned', spd:4, acc:9, hdl:13, color:'yellow'},
    {id:'r_4tun_4', name:'ZERO TUNING MODS ★★★★ TUNED TIRES', ser:'Tuned', spd:4, acc:9, hdl:9, color:'blue'},
    
    // ★★★★★ Improved
    {id:'r_5imp_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ IMPROVED TIRES', ser:'Improved', spd:6, acc:6, hdl:9, color:'green'},
    {id:'r_5imp_2', name:'QUARTZ SPEED PACKAGES ★★★★★ IMPROVED TIRES', ser:'Improved', spd:6, acc:9, hdl:14, color:'yellow'},
    {id:'r_5imp_3', name:'STICK MOTORSPORT ★★★★★ IMPROVED TIRES', ser:'Improved', spd:6, acc:9, hdl:9, color:'blue'},
    {id:'r_5imp_4', name:'TEAR ★★★★★ IMPROVED TIRES', ser:'Improved', spd:6, acc:6, hdl:18, color:'red'},
    
    // ★★★★★ Sport
    {id:'r_5spt_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ SPORT TIRES', ser:'Sport', spd:7, acc:6, hdl:9, color:'green'},
    {id:'r_5spt_2', name:'QUARTZ SPEED PACKAGES ★★★★★ SPORT TIRES', ser:'Sport', spd:6, acc:9, hdl:14, color:'yellow'},
    {id:'r_5spt_3', name:'STICK MOTORSPORT ★★★★★ SPORT TIRES', ser:'Sport', spd:7, acc:9, hdl:9, color:'blue'},
    {id:'r_5spt_4', name:'TEAR ★★★★★ SPORT TIRES', ser:'Sport', spd:7, acc:6, hdl:19, color:'red'},
    
    // ★★★★★ Tuned
    {id:'r_5tun_1', name:'DYNAMO AFTERMARKET KITS ★★★★★ TUNED TIRES', ser:'Tuned', spd:7, acc:7, hdl:11, color:'green'},
    {id:'r_5tun_2', name:'QUARTZ SPEED PACKAGES ★★★★★ TUNED TIRES', ser:'Tuned', spd:7, acc:11, hdl:14, color:'yellow'},
    {id:'r_5tun_3', name:'STICK MOTORSPORT ★★★★★ TUNED TIRES', ser:'Tuned', spd:7, acc:11, hdl:11, color:'blue'},
    {id:'r_5tun_4', name:'TEAR ★★★★★ TUNED TIRES', ser:'Tuned', spd:7, acc:7, hdl:22, color:'red'}
  ]
};