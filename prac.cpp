---->>>> ARRAY a[100]


4 -->  threads 


a[0] = 0

a[1] =1
a[2] = 4

#include<pthreads>







int* calSqr(int startIndex, int size)
{
    int*arr =new int[size];
    int val = startIndex;
    for(int x=0;x<size;x++)
    {
        arr[x] = val*val;
        val++;
    }
    return arr;
}




int calSum(int startIndex, int endIndex, int*arr )
{
    int sum=0;
    for(int x=0;x<endIndex;x++)
    {
        sum+=arr[x];
    }
    return sum;
}






int main()
{
int number = 100;
int nu_th = 5;
int size = number/nu_th;
int** result = new int*[nu_th] 
for(int x=0;x<nu_th;x++)
{
    result[x] = new int[size];
}

/////////////////////////////               Threads to calculate Square
pthread threads[nu-th];
for(int x=0;x<nu_th;x++)
{
    threads[x] = phtread.create(calSqr,size*x,size);

}

for(int x=0; x<nu_th;x++)
{
    result[x] =pthread.join( threads[x]);
}



/////////////////////////////               Threads to calculate SUM
pthread threads1[nu-th];
int temp=size;
for(int x=0;x<nu_th;x++)
{
    threads1[x] = phtread.create(calSum,size*x,temp,arr);
    temp+=size;
}

int* finalSum = new int[nu_th];
for(int x=0; x<nu_th;x++)
{
    finalSum[x] =pthread.join( threads1[x]);
}

int sum=0;
for(int x=0; x<nu_th;x++)
{
    sum+=finalSum[x];
}


}


