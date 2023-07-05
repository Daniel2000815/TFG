reset session
set terminal pngcairo size 1280, 720

$Data <<EOD
Criterios	Divisiones ahorradas	Tiempo
Ninguno	100	383
1	350	312
2	346	30
1+2	488	0
EOD

# Set the graph title and axis labels
set title "Divisiones ahorradas vs Criterios aplicados"
set xlabel "Criterios"
set ylabel "Divisiones ahorradas"
set ytics nomirror
set y2label "Tiempo"
set y2tics

set boxwidth 0.8
set style fill solid 0.4

plot $Data u 0:2:xtic(1) w boxes axes x1y1 ti "Divisiones ahorradas",\
        '' u 0:3 w lp pt 7 lw 2 axes x1y2  ti "Tiempo (ms)"