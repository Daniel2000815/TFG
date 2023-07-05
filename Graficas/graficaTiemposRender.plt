reset session

set term png size 1920, 1080 font "FiraCode,30"
set output 'LaptopHR.png'

set style data histogram
set style histogram cluster gap 1

set title "Portátil 1536 x 768 - FPS sobre AA" 
set xlabel "AA"
set ylabel "FPS"

set style fill solid border rgb "black"
set auto x
set yrange [0:*]
plot 'laptopHR.dat' using 2:xtic(1) title col, \
        '' using 3:xtic(1) title col, \
        '' using 4:xtic(1) title col, \
        '' using 5:xtic(1) title col, \
        '' using 6:xtic(1) title col