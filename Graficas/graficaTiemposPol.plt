reset session

# Set the output resolution and size
set term png size 1920, 1080 font "FiraCode,30"
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
Criterios       Divisiones ahorradas    Tiempo  Tiempo2
Ninguno	        0	                312     340	
1	        350	                312     314
2	        346	                341     318
1+2	        488	                281     261
EOD


# Set the graph title and axis labels
set title "Divisiones ahorradas vs Criterios - 20 Bases de Groebner reducidas" 
set xlabel "Criterios"
set ylabel "Divisiones ahorradas"
set ytics nomirror 
set y2tics nomirror 

set y2label "Tiempo (ms)" 

set boxwidth 0.8
set style fill solid 0.4

set yrange [0:1250]  # Set the y-axis range for time
set y2range [0:1250]  # Set the y-axis range for time

set output 'Criterios20.png'
plot $Data u 0:2:xtic(1) w boxes axes x1y1 ti "Divisiones ahorradas",\
        '' u 0:($3) w lp pt 15 lw 6 axes x1y2 ti "Tiempo sin fracciones (ms)",\
        '' u 0:($4) w lp pt 15 lw 6 axes x1y2 ti "Tiempo con fracciones (ms)"
