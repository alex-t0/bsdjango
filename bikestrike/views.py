from django.shortcuts import render

def index(request):
#    template = loader.get_template('bikestrike/index.html')
    context = { }
    return render(request, 'bikestrike/index.html', context)
