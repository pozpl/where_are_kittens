package DI::DIRole;
use Moose::Role;

has mongo =>(
    is => 'ro',
    isa => 'MongoDB::MongoClient',
    lifecycle => 'Singleton',
);

has mongo_database_name => (
    is       => 'ro',
    isa      => 'Str',
    default => 'development',
    lifecycle => 'Singleton',
);

has mongo_database => (
    is => 'ro',
    #isa => 'Misc::MongoDatabase',
    block => sub{
    	my $s = shift;
    	Misc::MongoDatabase->get_database(
    	   $s->param('mongo'), 
    	   $s->param('database_name')
    	);
    },
    dependencies => {
    	'mongo' => 'mongo',
    	'database_name' => 'mongo_database_name'
    },
    lifecycle => 'Singleton',
);

has 'markers_collection' => (
    'is' => 'ro',
    'block' => sub{
        my $s = shift;
        $s->param('$database')->get_collection('markers');
    },
    dependencies => {
    	'database' => 'mongo_database',
    },
    lifecycle => 'Singleton',
);

has 'markers_repository' => (
    'is' => 'ro',
    'isa' => 'Markers::MarkerRepository',
    dependencies => {
    	'markers_collection' => 'markers_collection',
    },
);

1;