reset session

set term png size 1920, 1080 font "FiraCode,30"
set output 'SobremesaLR.png'
set grid ytics lw 2

set style data histogram
set style histogram cluster gap 1

set title "Sobremesa 1280px x 640px - FPS sobre AA" 
set xlabel "AA"
set ylabel "FPS"

set style fill solid border rgb "black"
set auto x
set yrange [0:*]

# Configurar las líneas horizontales
set ytics out nomirror scale 0

plot 'sobremesaLR.dat' using 2:xtic(1) title col, \
        '' using 3:xtic(1) title col, \
        '' using 4:xtic(1) title col, \
        '' using 5:xtic(1) title col, \
        '' using 6:xtic(1) title col
