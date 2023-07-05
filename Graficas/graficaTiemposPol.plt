reset session

# Set the output resolution and size
set term png size 1920, 1080 font "FiraCode,30"

$Data <<EOD
Criterios    Divisiones ahorradas    Tiempo (ms)
Ninguno	0	780 
1	595	639 
2	475	732 
1+2	839	626 
EOD

# Set the graph title and axis labels
set title "Divisiones ahorradas vs Criterios - 50 Bases de Groebner reducidas" 
set xlabel "Criterios"
set ylabel "Divisiones ahorradas"
set ytics nomirror 
set y2tics nomirror 

set y2label "Tiempo (ms)" 

set boxwidth 0.8
set style fill solid 0.4

set yrange [0:1000]  # Set the y-axis range for time
set y2range [0:1000]  # Set the y-axis range for time

set output 'Criterios50.png'
plot $Data u 0:2:xtic(1) w boxes axes x1y1 ti "Divisiones ahorradas",\
        '' u 0:($3) w lp pt 15 lw 6 axes x1y2 ti "Tiempo (ms)"
