reset session

# Set the output resolution and size
set term png size 2880, 1200 font "FiraCode,30"
set grid ytics lw 2

# 50
# $Data <<EOD
# Criterios       Divisiones ahorradas    Tiempo  Tiempo2
# Ninguno	        0	                780     693	
# 1	        595	                639     584
# 2	        475	                732     685
# 1+2	        839	                626     573
# EOD

# 20
$Data <<EOD
Superficie                 "Reducciones"       "Tiempo"
"Plano"                    11                   34
"P. Elíp."          10	               41	
"P. Hiper."       18                45
"Esfera"                   272	               1222
"Elipsoide"                12                38
"Sage 1"                   354                368  
"Sage 2"                   448                  597
"Sage 3"                   271                  579
"Sage 4"                   78                   53
EOD


# Set the graph title and axis labels
set title "Implicitación con multivariate-polynomial" 
set logscale  y
set logscale y2

set xlabel "Superficie"
# set format x "\n"

# set bmargin 6

# set xtics rotate by 90 offset -0.8,-4.0

set xtics ("Plano" 1, "Parab.\nElíptico" 2, "Parab.\nHiperbólico" 3, "Esfera" 4, "Elipsoide" 5, "Sage 1" 6, "Sage 2" 7, "Sage 3" 8, "Sage 4" 9)



set ylabel "Reducciones"
set ytics nomirror 
set y2tics nomirror 

set y2label "Tiempo (ms)" 

set boxwidth 0.8
set style fill solid 0.4

set yrange [0:2000]  # Set the y-axis range for time
set y2range [0:2000]  # Set the y-axis range for time

set output 'TiemposImpRed.png'
plot $Data u 0:2:xtic(1) w boxes axes x1y1 ti  "Reducciones a cero" ,\
        ''  u 0:($3) w lp pt 15 lw 6 axes x1y2 ti  "Tiempo de cómputo"
