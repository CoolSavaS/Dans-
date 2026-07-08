# -*- coding: utf-8 -*-
import json
base=json.load(open('base.json'))
TR={}; 
try:
    import importlib.util
    spec=importlib.util.spec_from_file_location("tr","tr.py")
    trmod=importlib.util.module_from_spec(spec); spec.loader.exec_module(trmod)
    TR=trmod.TR
except Exception as e:
    print("no tr.py yet:",e)
CATMETA=base['catmeta']
# answer(en)->atr map, built from all translated answers, for distractor tr
ansmap={}
for o in base['q']:
    t=TR.get(o['id'])
    if t: ansmap[o['aen'].strip()]=t[1]
catlines=[]
for cat,m in CATMETA.items():
    catlines.append(f'  {m[0]}: {{ tr: {json.dumps(m[1],ensure_ascii=False)}, en: {json.dumps(m[2],ensure_ascii=False)}, icon: {json.dumps(m[3],ensure_ascii=False)} }},')
qlines=[]; trcount=0
for o in base['q']:
    qen=o['qen']; aen=o['aen']
    t=TR.get(o['id'])
    if t:
        qtr,atr = t[0],t[1]; ltr=t[2] if len(t)>2 else ""; trcount+=1
    else:
        hint=o['trhint'].strip()
        qtr=qen+((" ["+hint+"]") if hint else ""); atr=aen; ltr=""
    ws=[{"en":d,"tr":ansmap.get(d.strip(),d)} for d in o['dist']]
    qobj={"id":o['id'],"cat":o['catkey'],"scene":o['scene'],"type":"do","ezber":"",
          "q":{"en":qen,"tr":qtr},"a":{"en":aen,"tr":atr},
          "logic":{"en":t[3] if (t and len(t)>3) else "","tr":ltr},"w":ws,"ext":True}
    qlines.append("EXTQ.push("+json.dumps(qobj,ensure_ascii=False)+");")
out="/* AUTO-GENERATED — genişletilmiş DVSA soru bankası (685 soru). Kaynak: kullanıcının teori çalışma belgesi + PDF'ler. Kişisel, ticari olmayan. */\n"
out+="const CATS_EXT = {\n"+"\n".join(catlines)+"\n};\n"
out+="const EXTQ = [];\n"+"\n".join(qlines)+"\n"
# merge tail
out+="""
/* --- birleştir --- */
(function(){
  try { if (typeof CATS !== 'undefined') Object.assign(CATS, CATS_EXT); } catch(e){}
  try { if (typeof QUESTIONS !== 'undefined') for (var i=0;i<EXTQ.length;i++) QUESTIONS.push(EXTQ[i]); } catch(e){}
})();
"""
open('questions_ext.js','w',encoding='utf-8').write(out)
print("wrote questions_ext.js | total",len(base['q']),"| TR",trcount)
